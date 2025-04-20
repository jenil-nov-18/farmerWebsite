
import React from "react";
import { Link } from "react-router-dom";
import { Course } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Star, Clock, Users, BarChart } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="card-hover overflow-hidden border border-border/40">
      <Link to={`/learn/${course.id}`}>
        <div className="relative">
          <img
            src={course.image}
            alt={course.title}
            className="h-48 w-full object-cover"
          />
          {course.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-agro-green-600 px-2 py-0.5 text-xs font-medium text-white">
              Featured
            </span>
          )}
          {course.free && (
            <span className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
              Free
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 bottom-2 rounded-full bg-background/80 hover:bg-background"
            aria-label="Save course"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="flex items-center text-xs text-yellow-500">
              <Star className="mr-1 h-3.5 w-3.5 fill-yellow-500" />
              {course.rating}
            </span>
          </div>
          
          <h3 className="mb-1 text-base font-medium line-clamp-2">{course.title}</h3>
          
          <div className="mb-2 flex items-center text-xs text-muted-foreground">
            <span className="flex items-center">
              <Users className="mr-1 h-3.5 w-3.5" />
              {course.students?.toLocaleString()} students
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <BarChart className="mr-1 h-3.5 w-3.5" />
              {course.level}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-muted-foreground">By {course.instructor}</span>
            <Button
              size="sm"
              variant={course.free ? "outline" : "default"}
              className={course.free 
                ? "h-8 border-agro-green-600 text-agro-green-600 hover:bg-agro-green-50 dark:hover:bg-agro-green-950" 
                : "h-8 bg-agro-green-600 hover:bg-agro-green-700"
              }
            >
              {course.free ? "Start Learning" : "Enroll Now"}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseCard;
