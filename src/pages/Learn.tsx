
import React, { useState } from "react";
import { courses } from "@/data";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen, SlidersHorizontal, X } from "lucide-react";

const Learn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = searchQuery
      ? course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesLevel = activeLevel ? course.level === activeLevel : true;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-agro-green-100 dark:bg-agro-green-900/30 py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Learn Agricultural Skills from Experts
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Access free and premium courses to improve your farming practices, increase yields, and grow your business.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for courses..."
                className="pl-10 pr-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Course Listings */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-6">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block md:w-64 shrink-0`}
            >
              <div className="bg-card p-4 rounded-lg border shadow-sm space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Course Levels
                  </h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <Button
                        key={level}
                        variant={activeLevel === level ? "default" : "outline"}
                        className={`w-full justify-start ${
                          activeLevel === level
                            ? "bg-agro-green-600 hover:bg-agro-green-700"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveLevel(activeLevel === level ? null : level)
                        }
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Topics</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Organic Farming
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Livestock
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Pest Management
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Soil Health
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Marketing
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Duration</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Under 4 weeks
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      4-8 weeks
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Over 8 weeks
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setActiveLevel(null)}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Course Grid */}
            <div className="flex-1">
              {/* Current Filters */}
              {(activeLevel || searchQuery) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {activeLevel && (
                    <div className="bg-muted text-sm rounded-full px-3 py-1 flex items-center">
                      Level: {activeLevel}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => setActiveLevel(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="bg-muted text-sm rounded-full px-3 py-1 flex items-center">
                      Search: {searchQuery}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            
              <h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
              
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setActiveLevel(null);
                      setSearchQuery("");
                    }}
                    variant="outline"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="section-padding bg-agro-green-50 dark:bg-agro-green-900/10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to Share Your Knowledge?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Are you an agricultural expert? Join our platform as an instructor and help farmers improve their practices.
            </p>
            <Button size="lg" className="bg-agro-green-600 hover:bg-agro-green-700">
              Become an Instructor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;
