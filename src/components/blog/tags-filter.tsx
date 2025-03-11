'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, SortAsc, SortDesc } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface TagsFilterProps {
  allTags: string[]
  currentTag: string
}

export default function TagsFilter({ allTags, currentTag }: TagsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // State untuk menyimpan query string
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('query') || ''
  )
  
  // Ubah currentTag string menjadi array untuk mendukung multiple selection
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentTag ? currentTag.split(',') : []
  )
  
  const [open, setOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get('sort') || 'newest'
  )

  // Fungsi untuk membuat URL baru dengan parameter yang diperbarui
  const createUrlWithParams = (
    query: string, 
    tags: string[], 
    sort: string,
    page: string = '1'
  ) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    
    if (tags.length > 0) {
      params.set('tags', tags.join(','))
    } else {
      params.delete('tags')
    }
    
    if (sort) {
      params.set('sort', sort)
    } else {
      params.delete('sort')
    }
    
    params.set('page', page)
    
    return `${pathname}?${params.toString()}`
  }

  // Fungsi untuk menangani perubahan tag yang dipilih
  const handleTagSelection = (tag: string) => {
    let newTags: string[]
    
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag)
    } else {
      newTags = [...selectedTags, tag]
    }
    
    setSelectedTags(newTags)
    router.push(createUrlWithParams(searchQuery, newTags, sortOrder))
  }

  // Fungsi untuk menangani perubahan sort order
  const handleSortChange = (value: string) => {
    setSortOrder(value)
    router.push(createUrlWithParams(searchQuery, selectedTags, value))
  }
  
  // Fungsi untuk menangani live search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    
    // Gunakan debounce untuk menghindari terlalu banyak request
    const timeoutId = setTimeout(() => {
      router.push(createUrlWithParams(value, selectedTags, sortOrder))
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  // Fungsi untuk menghapus semua filter
  const clearAllFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
    setSortOrder('newest')
    router.push(pathname)
  }

  return (
    <div className="space-y-4">
      {/* Live Search Input */}
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari artikel..."
          className="w-full"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* Multi-select Tag Filter */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full sm:w-auto"
            >
              {selectedTags.length > 0 
                ? `${selectedTags.length} kategori dipilih`
                : "Pilih Kategori"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Cari kategori..." />
              <CommandEmpty>Tidak ada kategori yang ditemukan.</CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem
                    key={tag}
                    value={tag}
                    onSelect={() => handleTagSelection(tag)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTags.includes(tag) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Sorting Dropdown */}
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              <div className="flex items-center">
                <SortDesc className="mr-2 h-4 w-4" />
                Terbaru
              </div>
            </SelectItem>
            <SelectItem value="oldest">
              <div className="flex items-center">
                <SortAsc className="mr-2 h-4 w-4" />
                Terlama
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        {/* Clear Filter Button */}
        {(selectedTags.length > 0 || searchQuery || sortOrder !== 'newest') && (
          <Button variant="ghost" onClick={clearAllFilters} className="w-full sm:w-auto">
            Hapus semua filter
          </Button>
        )}
      </div>

      {/* Tampilkan tag yang dipilih */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleTagSelection(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 