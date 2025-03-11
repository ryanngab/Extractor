"use client";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  File,
  Folder,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Copy from "@/components/markdown/copy";

interface TreeItem {
  name: string;
  type: "file" | "folder";
  children?: TreeItem[];
  content?: string;
  language?: string;
}

interface CodePreviewTabsProps {
  preview?: React.ReactNode;
  code?: string;
  language?: string;
  fileName?: string;
  treeData?: TreeItem[];
  useTreePreview?: boolean;
}

// Fungsi untuk mendapatkan HTML/CSS/JS dari tree data
const extractCodeFromTree = (
  treeData: TreeItem[]
): { html: string; css: string; js: string } => {
  let html = "";
  let css = "";
  let js = "";

  const processTreeItem = (item: TreeItem) => {
    if (item.type === "file") {
      const ext = item.name.split(".").pop()?.toLowerCase();
      if (ext === "html" && item.content) {
        html = item.content;
      } else if (ext === "css" && item.content) {
        css = item.content;
      } else if ((ext === "js" || ext === "javascript") && item.content) {
        js = item.content;
      }
    } else if (item.type === "folder" && item.children) {
      item.children.forEach(processTreeItem);
    }
  };

  treeData.forEach(processTreeItem);

  return { html, css, js };
};

// Komponen Tree untuk menampilkan struktur file
const FileTree: React.FC<{
  items: TreeItem[];
  level?: number;
  onSelectFile?: (file: TreeItem) => void;
}> = ({ items, level = 0, onSelectFile }) => {
  const [expandedFolders, setExpandedFolders] = React.useState<
    Record<string, boolean>
  >({});

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  return (
    <ul className="pl-4">
      {items.map((item, index) => {
        const itemKey = `${level}-${index}-${item.name}`;
        const isExpanded = expandedFolders[itemKey] ?? level === 0;

        return (
          <li key={itemKey} className="py-1">
            <div
              className={`flex items-center text-sm ${
                item.type === "file" ? "cursor-pointer hover:text-primary" : ""
              }`}
              onClick={() => {
                if (item.type === "file" && onSelectFile) {
                  onSelectFile(item);
                } else if (item.type === "folder") {
                  toggleFolder(itemKey);
                }
              }}
            >
              {item.type === "folder" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(itemKey);
                  }}
                  className="mr-1"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}

              {item.type === "folder" ? (
                <Folder className="h-4 w-4 mr-1.5 text-blue-500" />
              ) : (
                <File className="h-4 w-4 mr-1.5 text-gray-500" />
              )}

              <span>{item.name}</span>
            </div>

            {item.type === "folder" && isExpanded && item.children && (
              <FileTree
                items={item.children}
                level={level + 1}
                onSelectFile={onSelectFile}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

// Komponen IFrame untuk preview code
const CodePreview: React.FC<{ html: string; css: string; js: string }> = ({
  html,
  css,
  js,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        // Buat HTML lengkap dengan CSS dan JS
        const fullHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${js}</script>
            </body>
          </html>
        `;

        iframeDoc.open();
        iframeDoc.write(fullHtml);
        iframeDoc.close();
      }
    }
  }, [html, css, js]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[400px] border-0 rounded-md bg-white"
      title="Code Preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
};

const CodePreviewTabs: React.FC<CodePreviewTabsProps> = ({
  preview,
  code = "",
  language = "jsx",
  fileName = "App.jsx",
  treeData = [],
  useTreePreview = false,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<TreeItem | null>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("preview");
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { isSignedIn } = useAuth();

  const handleSelectFile = (file: TreeItem) => {
    setSelectedFile(file);
  };

  // Kode yang akan ditampilkan (dari file yang dipilih atau default)
  const displayCode = selectedFile?.content || code;
  const displayLanguage = selectedFile?.language || language;
  const displayFileName = selectedFile?.name || fileName;

  // Ekstrak kode HTML, CSS, dan JS dari tree jika useTreePreview true
  const { html, css, js } =
    useTreePreview && treeData.length > 0
      ? extractCodeFromTree(treeData)
      : { html: "", css: "", js: "" };

  const handleTabChange = (value: string) => {
    if (value === "code" && !isSignedIn) {
      setIsLoginDialogOpen(true);
      // Tab tetap pada preview
      return;
    }
    setActiveTab(value);
  };

  return (
    <div className="rounded-md border shadow-sm overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex items-center justify-between border-b px-4">
          <TabsList className="h-12">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger
              value="code"
              className={!isSignedIn ? "cursor-pointer opacity-70" : ""}
            >
              Code
              {!isSignedIn && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              )}
            </TabsTrigger>
          </TabsList>
          {selectedFile && activeTab === "code" && (
            <div className="text-sm text-muted-foreground">
              {displayFileName}
            </div>
          )}
        </div>

        <TabsContent value="preview" className="p-4">
          {useTreePreview && treeData.length > 0 ? (
            <CodePreview html={html} css={css} js={js} />
          ) : (
            <div className="rounded-md border p-4">{preview}</div>
          )}
        </TabsContent>

        {isSignedIn && (
          <TabsContent value="code" className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 border-t">
              {treeData.length > 0 && sidebarOpen && (
                <div className="lg:col-span-1 border-r p-2 max-h-96 overflow-y-auto">
                  <FileTree items={treeData} onSelectFile={handleSelectFile} />
                </div>
              )}

              <div
                className={`${
                  treeData.length > 0 && sidebarOpen
                    ? "lg:col-span-3"
                    : "col-span-full"
                } max-h-96 overflow-auto`}
              >
                <div className="text-xs p-2 bg-muted border-b flex justify-between items-center">
                  <div className="flex items-center">
                    {treeData.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 mr-2"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
                      >
                        {sidebarOpen ? (
                          <PanelLeftClose className="h-4 w-4" />
                        ) : (
                          <PanelLeft className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {displayFileName}
                  </div>
                  <Copy content={displayCode} />
                </div>
                <pre
                  className={`language-${displayLanguage} p-4 m-0 relative group`}
                >
                  <code className={`language-${displayLanguage}`}>
                    {displayCode}
                  </code>
                </pre>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Diperlukan</DialogTitle>
            <DialogDescription>
              Anda perlu login untuk mengakses kode sumber. Login untuk melihat
              semua fitur yang tersedia.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLoginDialogOpen(false)}
            >
              Batalkan
            </Button>
            <Button asChild>
              <Link href="/sign-in">Login Sekarang</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodePreviewTabs;
