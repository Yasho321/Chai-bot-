import { useState, useEffect } from 'react';
import { useCourseStore } from '../stores/courseStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { FileText, Plus, Calendar, BookOpen, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const ChapterManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [chapterName, setChapterName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const { courses, chapters, fetchCourses, fetchChapters, createChapter, isLoading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
    fetchChapters();
  }, [fetchCourses, fetchChapters]);

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    if (!chapterName.trim() || !selectedCourseId) return;

    const result = await createChapter({
      chapterName: chapterName.trim(),
      courseId: selectedCourseId,
    });

    if (result.success) {
      setChapterName('');
      setSelectedCourseId('');
      setIsCreateDialogOpen(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Chapter Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage chapters for your courses
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:shadow-glow transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              Create Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chapter</DialogTitle>
              <DialogDescription>
                Add a new chapter to one of your courses
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chapterName">Chapter Name</Label>
                <Input
                  id="chapterName"
                  value={chapterName}
                  onChange={(e) => setChapterName(e.target.value)}
                  placeholder="Enter chapter name (e.g., Getting started with Node.js)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseSelect">Select Course</Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId} required>
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

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !chapterName.trim() || !selectedCourseId}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Chapter'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Chapters List */}
      <div>
        {isLoading && chapters.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading chapters...</p>
            </div>
          </div>
        ) : chapters.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-primary to-primary-glow p-6 rounded-2xl">
                  <FileText className="h-12 w-12 text-primary-foreground mx-auto" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No chapters yet</h3>
                <p className="text-muted-foreground mt-1">
                  {courses.length === 0 
                    ? 'Create a course first, then add chapters to it'
                    : 'Create your first chapter to organize your course content'
                  }
                </p>
              </div>
              {courses.length > 0 && (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-shadow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Chapter
                </Button>
              )}
            </div>
          </Card>
        ) : (
            <ScrollArea className="max-h-[65vh]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <Card key={chapter._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary/50 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg line-clamp-2">{chapter.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Created {formatDate(chapter.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Course:</span>
                      <span className="font-medium truncate">
                        {getCourseName(chapter.course)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Chapter ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {chapter._id.slice(-8)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="bg-success/10 text-success px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </ScrollArea>
        )}
      </div>
    </div>
    </div>
  );
};

export default ChapterManagement;