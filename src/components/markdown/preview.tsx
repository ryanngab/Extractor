import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Preview() {
  return (
    <>
      <Tabs defaultValue="preview" className="pt-5 pb-1">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">ini preview</TabsContent>
        <TabsContent value="code">
          <Tabs defaultValue="preview" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="javascript">Javascript</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="tailwinds">Tailwinds</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="ruby">Ruby</TabsTrigger>
              <TabsTrigger value="bootstrap">Bootstrap</TabsTrigger>
              <TabsTrigger value="c++">C++</TabsTrigger>
              <TabsTrigger value="c#">C#</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <Card></Card>
            </TabsContent>
            <TabsContent value="javascript">
              <Card></Card>
            </TabsContent>
            <TabsContent value="html">
              <Card></Card>
            </TabsContent>
            <TabsContent value="css">
              <Card></Card>
            </TabsContent>
            <TabsContent value="tailwinds">
              <Card></Card>
            </TabsContent>
            <TabsContent value="java">
              <Card></Card>
            </TabsContent>
            <TabsContent value="python">
              <Card></Card>
            </TabsContent>
            <TabsContent value="ruby">
              <Card></Card>
            </TabsContent>
            <TabsContent value="bootstrap">
              <Card></Card>
            </TabsContent>
            <TabsContent value="c++">
              <Card></Card>
            </TabsContent>
            <TabsContent value="c#">
              <Card></Card>
            </TabsContent>
            <TabsContent value="c">
              <Card></Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </>
  );
}
