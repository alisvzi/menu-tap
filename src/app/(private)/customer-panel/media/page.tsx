"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadFiles } from "@/utility/uploads";
import {
  File,
  FileText,
  Folder,
  FolderPlus,
  Grid3X3,
  HardDrive,
  Image,
  ImageIcon,
  List,
  MoreHorizontal,
  Music,
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video" | "document" | "audio" | "other";
  size: number;
  url: string;
  thumbnail?: string;
  uploadDate: string;
  folder?: string;
  tags: string[];
  alt?: string;
  description?: string;
}

interface MediaFolder {
  id: string;
  name: string;
  fileCount: number;
  createdDate: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: "1",
      name: "pizza-margherita.jpg",
      type: "image",
      size: 245760,
      url: "/images/pizza-margherita.jpg",
      thumbnail: "/images/pizza-margherita-thumb.jpg",
      uploadDate: "1402/08/20",
      folder: "pizza",
      tags: ["پیتزا", "مارگاریتا", "ایتالیایی"],
      alt: "پیتزا مارگاریتا",
      description: "پیتزا مارگاریتا با پنیر موزارلا و ریحان تازه",
    },
    {
      id: "2",
      name: "burger-classic.jpg",
      type: "image",
      size: 189440,
      url: "/images/burger-classic.jpg",
      thumbnail: "/images/burger-classic-thumb.jpg",
      uploadDate: "1402/08/19",
      folder: "burger",
      tags: ["برگر", "کلاسیک", "گوشت"],
      alt: "برگر کلاسیک",
      description: "برگر کلاسیک با گوشت گاو و سبزیجات تازه",
    },
    {
      id: "3",
      name: "menu-video.mp4",
      type: "video",
      size: 5242880,
      url: "/videos/menu-video.mp4",
      uploadDate: "1402/08/18",
      tags: ["ویدیو", "تبلیغاتی", "منو"],
      description: "ویدیو تبلیغاتی منوی رستوران",
    },
    {
      id: "4",
      name: "menu-pdf.pdf",
      type: "document",
      size: 1048576,
      url: "/documents/menu-pdf.pdf",
      uploadDate: "1402/08/17",
      tags: ["منو", "PDF", "چاپی"],
      description: "نسخه PDF منوی رستوران",
    },
  ]);

  const [folders, setFolders] = useState<MediaFolder[]>([
    { id: "1", name: "پیتزا", fileCount: 12, createdDate: "1402/08/15" },
    { id: "2", name: "برگر", fileCount: 8, createdDate: "1402/08/10" },
    { id: "3", name: "نوشیدنی", fileCount: 15, createdDate: "1402/08/05" },
    { id: "4", name: "دسر", fileCount: 6, createdDate: "1402/08/01" },
  ]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileTypeBadge = (type: string) => {
    const variants = {
      image: "default",
      video: "secondary",
      document: "outline",
      audio: "destructive",
      other: "secondary",
    };

    const labels = {
      image: "تصویر",
      video: "ویدیو",
      document: "سند",
      audio: "صوت",
      other: "سایر",
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] as any}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) => tag.includes(searchQuery));
    const matchesType = filterType === "all" || file.type === filterType;
    const matchesFolder = !currentFolder || file.folder === currentFolder;

    return matchesSearch && matchesType && matchesFolder;
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    setUploadProgress(10);
    try {
      const selected = Array.from(uploadedFiles);
      const uploaded = await uploadFiles(selected, currentFolder);
      setUploadProgress(100);

      const nowFa = new Date().toLocaleDateString("fa-IR");
      const newMedia: MediaFile[] = uploaded.map((f, idx) => ({
        id: Date.now().toString() + idx,
        name: f.name,
        type: f.type.startsWith("image/")
          ? "image"
          : f.type.startsWith("video/")
          ? "video"
          : f.type.startsWith("audio/")
          ? "audio"
          : f.type === "application/pdf"
          ? "document"
          : "other",
        size: f.size,
        url: f.url,
        thumbnail: f.type.startsWith("image/") ? f.url : undefined,
        uploadDate: nowFa,
        folder: currentFolder,
        tags: [],
        description: "",
      }));

      setFiles((prev) => [...newMedia, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteFiles = (fileIds: string[]) => {
    setFiles((prev) => prev.filter((file) => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: MediaFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      fileCount: 0,
      createdDate: new Date().toLocaleDateString("fa-IR"),
    };

    setFolders((prev) => [newFolder, ...prev]);
    setNewFolderName("");
    setShowNewFolderDialog(false);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const usedSpace = totalSize;
  const totalSpace = 1073741824; // 1GB
  const usagePercentage = (usedSpace / totalSpace) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ImageIcon className="h-8 w-8" />
            مدیریت رسانه
          </h1>
          <p className="text-muted-foreground">
            مدیریت تصاویر، ویدیوها و فایل‌های منو
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="ml-2 h-4 w-4" />
            آپلود فایل
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>در حال آپلود...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                فضای ذخیره‌سازی
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>استفاده شده</span>
                  <span>{formatFileSize(usedSpace)}</span>
                </div>
                <Progress value={usagePercentage} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{usagePercentage.toFixed(1)}% استفاده شده</span>
                  <span>{formatFileSize(totalSpace)} کل</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  پوشه‌ها
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewFolderDialog(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={currentFolder === "" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentFolder("")}
              >
                <Folder className="ml-2 h-4 w-4" />
                همه فایل‌ها
                <Badge variant="outline" className="mr-auto">
                  {files.length}
                </Badge>
              </Button>

              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={currentFolder === folder.name ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setCurrentFolder(folder.name)}
                >
                  <Folder className="ml-2 h-4 w-4" />
                  {folder.name}
                  <Badge variant="outline" className="mr-auto">
                    {folder.fileCount}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>آمار فایل‌ها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>تصاویر</span>
                <span>{files.filter((f) => f.type === "image").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>ویدیوها</span>
                <span>{files.filter((f) => f.type === "video").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>اسناد</span>
                <span>{files.filter((f) => f.type === "document").length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>سایر</span>
                <span>{files.filter((f) => f.type === "other").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در فایل‌ها..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 w-64"
                    />
                  </div>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه</SelectItem>
                      <SelectItem value="image">تصاویر</SelectItem>
                      <SelectItem value="video">ویدیوها</SelectItem>
                      <SelectItem value="document">اسناد</SelectItem>
                      <SelectItem value="audio">صوت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedFiles.length} فایل انتخاب شده
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف فایل‌ها</AlertDialogTitle>
                          <AlertDialogDescription>
                            آیا مطمئن هستید که می‌خواهید {selectedFiles.length}{" "}
                            فایل انتخاب شده را حذف کنید؟
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>انصراف</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFiles(selectedFiles)}
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">هیچ فایلی یافت نشد</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery
                      ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                      : "هنوز هیچ فایلی آپلود نکرده‌اید"}
                  </p>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="ml-2 h-4 w-4" />
                    آپلود اولین فایل
                  </Button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-2"
                  }
                >
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedFiles.includes(file.id)
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      } ${
                        viewMode === "list"
                          ? "flex items-center gap-4"
                          : "space-y-3"
                      }`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      {viewMode === "grid" ? (
                        <>
                          <div className="aspect-square bg-muted rounded flex items-center justify-center">
                            {file.type === "image" && file.thumbnail ? (
                              <img
                                src={file.thumbnail}
                                alt={file.alt || file.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="text-muted-foreground">
                                {getFileIcon(file.type)}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm truncate">
                                {file.name}
                              </h4>
                              {getFileTypeBadge(file.type)}
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.uploadDate}</span>
                            </div>

                            {file.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {file.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {file.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{file.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                              {file.type === "image" && file.thumbnail ? (
                                <img
                                  src={file.thumbnail}
                                  alt={file.alt || file.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <div className="text-muted-foreground">
                                  {getFileIcon(file.type)}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {file.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)} • {file.uploadDate}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {getFileTypeBadge(file.type)}
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showNewFolderDialog}
        onOpenChange={setShowNewFolderDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ایجاد پوشه جدید</AlertDialogTitle>
            <AlertDialogDescription>
              نام پوشه جدید را وارد کنید
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">نام پوشه</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="نام پوشه..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={createFolder}
              disabled={!newFolderName.trim()}
            >
              ایجاد پوشه
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
