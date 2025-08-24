import { useState, useEffect } from 'react';
import { useCourseStore } from '../stores/courseStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { BookOpen, Plus, Calendar, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const CourseManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const { courses, fetchCourses, createCourse, isLoading } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseName.trim()) return;

    const result = await createCourse(courseName.trim());
    if (result.success) {
      setCourseName('');
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your courses
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-shadow">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your learning platform
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name (e.g., Node.js Fundamentals)"
                  required
                />
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
                  disabled={isLoading || !courseName.trim()}
                  className="bg-gradient-to-r from-primary to-primary-glow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Courses List */}
      <div>
        {isLoading && courses.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-primary to-primary-glow p-6 rounded-2xl">
                  <BookOpen className="h-12 w-12 text-primary-foreground mx-auto" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">No courses yet</h3>
                <p className="text-muted-foreground mt-1">
                  Create your first course to get started with VTT Buddy
                </p>
              </div>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow transition-shadow"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Created {formatDate(course.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Course ID:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {course._id.slice(-8)}
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
        )}
      </div>
    </div>
  );
};

export default CourseManagement;