import { useState, useEffect, useCallback } from 'react';
import { useCourseStore } from '../stores/courseStore';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Upload, FileVideo, Trash2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import toast from 'react-hot-toast';

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { courses, chapters, fetchCourses, fetchChapters, uploadVTTFiles, isLoading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
    fetchChapters();
  }, [fetchCourses, fetchChapters]);

  // Filter chapters based on selected course
  const filteredChapters = chapters.filter(chapter => 
    selectedCourseId ? chapter.course === selectedCourseId : true
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const vttFiles = files.filter(file => file.name.toLowerCase().endsWith('.vtt'));
    
    if (vttFiles.length !== files.length) {
      toast.error('Please only upload VTT files');
    }
    
    if (vttFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...vttFiles]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const vttFiles = files.filter(file => file.name.toLowerCase().endsWith('.vtt'));
    
    if (vttFiles.length !== files.length) {
      toast.error('Please only upload VTT files');
    }
    
    if (vttFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...vttFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !selectedChapterId || !selectedCourseId) {
      toast.error('Please select files, course, and chapter');
      return;
    }

    const result = await uploadVTTFiles(selectedFiles, selectedChapterId, selectedCourseId);
    if (result.success) {
      setSelectedFiles([]);
      setSelectedCourseId('');
      setSelectedChapterId('');
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Upload VTT Files</h1>
          <p className="text-muted-foreground mt-1">
            Upload video transcript files to enhance your AI learning assistant
          </p>
        </div>

        <Separator />

        {/* Course and Chapter Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select Chapter</Label>
            <Select 
              value={selectedChapterId} 
              onValueChange={setSelectedChapterId}
              disabled={!selectedCourseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a chapter" />
              </SelectTrigger>
              <SelectContent>
                {filteredChapters.map((chapter) => (
                  <SelectItem key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* File Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5" />
              VTT File Upload
            </CardTitle>
            <CardDescription>
              Drag and drop your VTT files here, or click to select files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept=".vtt"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-20"></div>
                  <div className="relative bg-primary p-4 rounded-2xl">
                    <Upload className="h-8 w-8 text-primary-foreground mx-auto" />
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium">
                    {dragActive ? 'Drop your VTT files here' : 'Upload VTT Files'}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Drag and drop or click to select multiple VTT files
                  </p>
                </div>
                
                <Button variant="outline" className="mt-4">
                  <Upload className="h-4 w-4 mr-2" />
                  Select Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Selected Files ({selectedFiles.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFiles([])}
                >
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-60">
                <div className="space-y-2 pr-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FileVideo className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        {selectedCourseId && selectedChapterId && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Ready to Upload</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Files will be uploaded to <strong>{getCourseName(selectedCourseId)}</strong> - 
                    Chapter: <strong>{filteredChapters.find(c => c._id === selectedChapterId)?.title}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Add bottom padding to prevent content from being hidden behind the sticky button */}
        <div className="pb-20"></div>
        </div>
      </div>

      {/* Sticky Upload Button */}
      <div className="border-t border-border bg-background p-4 mt-auto">
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={!selectedFiles.length || !selectedChapterId || !selectedCourseId || isLoading}
            className="bg-primary hover:shadow-glow transition-shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;