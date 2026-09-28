import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  students as initialStudents,
  courses as initialCourses,
} from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  
  // Actions สำหรับการจัดการวิชา
  addCourse: (course: Course) => void;
  removeCourse: (courseCode: string) => void;
  removeInstructor: (courseCode: string, instructorName: string) => void;
  
  // Actions สำหรับการลงทะเบียน
  enrollStudents: (courseCode: string, studentIds: string[]) => void;
  unenrollStudent: (courseCode: string, studentId: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, course],
        })),

      removeCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          students: state.students.map((s) => ({
            ...s,
            enrolledCourses: s.enrolledCourses.filter((code) => code !== courseCode),
          })),
        })),

      removeInstructor: (courseCode, instructorName) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseCode === courseCode
              ? {
                  ...c,
                  instructors: (c.instructors || []).filter((i) => i !== instructorName),
                }
              : c
          ),
        })),

      enrollStudents: (courseCode, studentIds) =>
        set((state) => ({
          students: state.students.map((s) => {
            if (studentIds.includes(s.studentId) && !s.enrolledCourses.includes(courseCode)) {
              return { ...s, enrolledCourses: [...s.enrolledCourses, courseCode] };
            }
            return s;
          }),
        })),

      unenrollStudent: (courseCode, studentId) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === studentId
              ? {
                  ...s,
                  enrolledCourses: s.enrolledCourses.filter((code) => code !== courseCode),
                }
              : s
          ),
        })),
    }),
    {
      name: "lab16-2569-680610674", 
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }), 
    }
  )
);