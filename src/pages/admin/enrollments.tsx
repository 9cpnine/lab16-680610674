import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminEnrollmentsPage() {
  const {
    students,
    courses,
    enrollStudents,
    unenrollStudent,
  } = useEnrollmentStore();

  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudents, setSelectedStudents] =
    useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [mode, setMode] =
    useState<"course" | "student">("course");

  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  /**
   * Anchor สำหรับ Combobox นักศึกษาโดยเฉพาะ
   * ใช้ ref ตัวเดียวกับ ComboboxChips และ ComboboxContent
   */
  const studentAnchor = useComboboxAnchor();

  const availableStudents = students.filter(
    (s) => !s.enrolledCourses.includes(selectedCourse)
  );

  const filteredStudents = availableStudents.filter((s) => {
    const fullName =
      `${s.firstName} ${s.lastName}`.toLowerCase();

    const studentId = s.studentId.toLowerCase();
    const search = inputValue.toLowerCase();

    return (
      fullName.includes(search) ||
      studentId.includes(search)
    );
  });

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedStudents([]);
    setInputValue("");
  };

  const handleEnroll = () => {
    if (
      !selectedCourse ||
      selectedStudents.length === 0
    ) {
      return;
    }

    enrollStudents(
      selectedCourse,
      selectedStudents
    );

    setOpen(false);
    setSelectedCourse("");
    setSelectedStudents([]);
    setInputValue("");
  };

  const getStudentName = (id: string) => {
    const student = students.find(
      (st) => st.studentId === id
    );

    return student
      ? `${student.firstName} ${student.lastName}`
      : id;
  };

  const getCourseDisplay = (code: string) => {
    if (!code) {
      return "เลือกวิชา...";
    }

    if (code === "all") {
      return "ทุกวิชา";
    }

    const course = courses.find(
      (c) => c.courseCode === code
    );

    return course
      ? `${course.courseCode} — ${course.courseTitle}`
      : code;
  };

  const getStudentDisplay = (id: string) => {
    if (!id) {
      return "เลือกนักศึกษา...";
    }

    if (id === "all") {
      return "ทุกคน";
    }

    const student = students.find(
      (s) => s.studentId === id
    );

    return student
      ? `${student.studentId} — ${student.firstName} ${student.lastName}`
      : id;
  };

  let displayCourses = courses;

  if (
    mode === "course" &&
    filterCourse !== "all"
  ) {
    displayCourses = courses.filter(
      (course) =>
        course.courseCode === filterCourse
    );
  } else if (
    mode === "student" &&
    filterStudent !== "all"
  ) {
    const student = students.find(
      (s) => s.studentId === filterStudent
    );

    const enrolledCodes = student
      ? student.enrolledCourses
      : [];

    displayCourses = courses.filter(
      (course) =>
        enrolledCodes.includes(course.courseCode)
    );
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* =========================================================
          Header
      ========================================================= */}
      <div className="min-w-0">
        <h1 className="text-xl font-semibold">
          จัดการการลงทะเบียน
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      {/* =========================================================
          Add Enrollment Dialog
      ========================================================= */}
      <div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!isOpen) {
              setSelectedCourse("");
              setSelectedStudents([]);
              setInputValue("");
            }
          }}
        >
          <DialogTrigger
            render={
              <Button className="gap-2" />
            }
          >
            <PlusCircle className="h-4 w-4" />
            ลงทะเบียนให้นักศึกษา
          </DialogTrigger>

          <DialogContent className="w-[calc(100vw-2rem)] max-w-lg overflow-visible">
            <DialogHeader>
              <DialogTitle>
                ลงทะเบียนให้นักศึกษา
              </DialogTitle>

              <DialogDescription>
                เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น
                (เลือกได้มากกว่า 1 คน)
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 min-w-0">
              {/* =================================================
                  Course Select
              ================================================= */}
              <div className="grid gap-1.5 w-full min-w-0">
                <Label>วิชา</Label>

                <div className="w-full min-w-0">
                  <Select
                    value={selectedCourse}
                    onValueChange={(value) =>
                      handleCourseChange(
                        value || ""
                      )
                    }
                  >
                    <SelectTrigger className="w-full min-w-0 max-w-full overflow-hidden">
                      <span
                        data-slot="select-value"
                        className={`min-w-0 flex-1 truncate text-left ${
                          !selectedCourse
                            ? "text-muted-foreground"
                            : ""
                        }`}
                      >
                        {getCourseDisplay(
                          selectedCourse
                        )}
                      </span>
                    </SelectTrigger>

                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem
                          key={course.courseCode}
                          value={course.courseCode}
                          label={`${course.courseCode} — ${course.courseTitle}`}
                        >
                          {course.courseCode} —{" "}
                          {course.courseTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* =================================================
                  Student Combobox
              ================================================= */}
              <div className="grid gap-1.5 w-full min-w-0">
                <Label>นักศึกษา</Label>

                <div className="w-full min-w-0 max-w-full">
                  <Combobox
                    multiple
                    disabled={!selectedCourse}
                    value={selectedStudents}
                    onValueChange={(value: any) => {
                      setSelectedStudents(value);
                    }}
                  >
                    <ComboboxChips
                      ref={studentAnchor}
                      className="w-full min-w-0 max-w-full"
                    >
                      {selectedStudents.map((id) => (
                        <ComboboxChip
                          key={id}
                          value={id}
                          className="min-w-0 max-w-full"
                        >
                          <span className="min-w-0 max-w-[200px] truncate">
                            {getStudentName(id)}
                          </span>
                        </ComboboxChip>
                      ))}

                      <ComboboxChipsInput
                        className="min-w-0 flex-1"
                        placeholder={
                          selectedCourse
                            ? "พิมพ์ชื่อ หรือรหัสนักศึกษา..."
                            : "กรุณาเลือกวิชาก่อน"
                        }
                        value={inputValue}
                        onChange={(event) =>
                          setInputValue(
                            event.target.value
                          )
                        }
                      />
                    </ComboboxChips>

                    <ComboboxContent
                      anchor={studentAnchor}
                      className="w-[var(--anchor-width)] min-w-0 max-w-[var(--available-width)]"
                    >
                      {filteredStudents.map(
                        (student) => (
                          <ComboboxItem
                            key={student.studentId}
                            value={student.studentId}
                          >
                            <span className="min-w-0 truncate">
                              {student.studentId} —{" "}
                              {student.firstName}{" "}
                              {student.lastName}
                            </span>
                          </ComboboxItem>
                        )
                      )}

                      {filteredStudents.length === 0 &&
                        selectedCourse && (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            ไม่มีรายชื่อนักศึกษา
                          </div>
                        )}
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>
            </div>

            {/* =================================================
                Footer
            ================================================= */}
            <DialogFooter>
              <Button
                onClick={handleEnroll}
                disabled={
                  !selectedCourse ||
                  selectedStudents.length === 0
                }
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                ลงทะเบียน (
                {selectedStudents.length} คน)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* =========================================================
          Search Tabs
      ========================================================= */}
      <Tabs
        value={mode}
        onValueChange={(value) =>
          setMode(
            value as "course" | "student"
          )
        }
      >
        <TabsList>
          <TabsTrigger value="course">
            ค้นหาตามวิชา
          </TabsTrigger>

          <TabsTrigger value="student">
            ค้นหาตามนักศึกษา
          </TabsTrigger>
        </TabsList>

        {/* =======================================================
            Filter By Course
        ======================================================= */}
        <TabsContent
          value="course"
          className="pt-4 min-w-0"
        >
          <div className="w-full min-w-0">
            <Select
              value={filterCourse}
              onValueChange={(value) =>
                setFilterCourse(
                  value || "all"
                )
              }
            >
              <SelectTrigger className="w-full min-w-0 max-w-full overflow-hidden">
                <span
                  data-slot="select-value"
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {getCourseDisplay(
                    filterCourse
                  )}
                </span>
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="all"
                  label="ทุกวิชา"
                >
                  ทุกวิชา
                </SelectItem>

                {courses.map((course) => (
                  <SelectItem
                    key={course.courseCode}
                    value={course.courseCode}
                    label={`${course.courseCode} — ${course.courseTitle}`}
                  >
                    {course.courseCode} —{" "}
                    {course.courseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        {/* =======================================================
            Filter By Student
        ======================================================= */}
        <TabsContent
          value="student"
          className="pt-4 min-w-0"
        >
          <div className="w-full min-w-0">
            <Select
              value={filterStudent}
              onValueChange={(value) =>
                setFilterStudent(
                  value || "all"
                )
              }
            >
              <SelectTrigger className="w-full min-w-0 max-w-full overflow-hidden">
                <span
                  data-slot="select-value"
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {getStudentDisplay(
                    filterStudent
                  )}
                </span>
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  value="all"
                  label="ทุกคน"
                >
                  ทุกคน
                </SelectItem>

                {students.map((student) => (
                  <SelectItem
                    key={student.studentId}
                    value={student.studentId}
                    label={`${student.studentId} — ${student.firstName} ${student.lastName}`}
                  >
                    {student.studentId} —{" "}
                    {student.firstName}{" "}
                    {student.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      {/* =========================================================
          Table
      ========================================================= */}
      <div className="rounded-lg border bg-card min-w-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                รหัสวิชา
              </TableHead>

              <TableHead>
                ชื่อวิชา
              </TableHead>

              <TableHead className="text-center w-[120px]">
                จำนวน นศ.
              </TableHead>

              <TableHead>
                นักศึกษาที่ลงทะเบียน
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {displayCourses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  ไม่มีข้อมูลรายวิชา
                </TableCell>
              </TableRow>
            ) : (
              displayCourses.map((course) => {
                const enrolledStudents =
                  students.filter((student) =>
                    student.enrolledCourses.includes(
                      course.courseCode
                    )
                  );

                return (
                  <TableRow
                    key={course.courseCode}
                  >
                    <TableCell className="font-medium">
                      {course.courseCode}
                    </TableCell>

                    <TableCell className="max-w-[280px]">
                      <span
                        className="block truncate"
                        title={course.courseTitle}
                      >
                        {course.courseTitle}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {enrolledStudents.length}
                    </TableCell>

                    <TableCell className="min-w-0">
                      {enrolledStudents.length > 0 ? (
                        <div className="flex flex-wrap gap-1 min-w-0">
                          {enrolledStudents.map(
                            (student) => (
                              <Badge
                                key={student.studentId}
                                variant="outline"
                                className="flex items-center gap-1 max-w-full pr-1.5 pl-2.5 py-0.5 bg-blue-500/15 text-blue-600 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                              >
                                <span
                                  className="truncate max-w-[180px]"
                                  title={`${student.firstName} ${student.lastName}`}
                                >
                                  {student.firstName}{" "}
                                  {student.lastName}
                                </span>

                                <button
                                  type="button"
                                  className="flex shrink-0 items-center justify-center rounded-full p-0.5 hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
                                  onClick={() =>
                                    unenrollStudent(
                                      course.courseCode,
                                      student.studentId
                                    )
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            )
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          -
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}