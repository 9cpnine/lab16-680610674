import { useState } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default function AdminCoursesPage() {
  const {
    courses,
    addCourse,
    removeCourse,
    removeInstructor,
  } = useEnrollmentStore();

  const [open, setOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedInstructors, setSelectedInstructors] =
    useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // ใช้ anchor ตัวเดียวกับ ComboboxChips และ ComboboxContent
  const anchor = useComboboxAnchor();

  const existingInstructors = Array.from(
    new Set(
      courses.flatMap((c) => c.instructors || [])
    )
  );

  const filteredInstructors =
    existingInstructors.filter((inst) =>
      inst
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );

  const isDuplicate = courses.some(
    (c) =>
      c.courseCode.toLowerCase() ===
      courseCode.toLowerCase()
  );

  const handleAddCourse = () => {
    if (
      isDuplicate ||
      !courseCode ||
      !courseTitle
    ) {
      return;
    }

    addCourse({
      courseCode: courseCode.toUpperCase(),
      courseTitle,
      instructors: selectedInstructors,
    });

    setOpen(false);
    setCourseCode("");
    setCourseTitle("");
    setSelectedInstructors([]);
    setInputValue("");
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">
            จัดการวิชาเรียน
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            {courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก
            ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!isOpen) {
              setCourseCode("");
              setCourseTitle("");
              setSelectedInstructors([]);
              setInputValue("");
            }
          }}
        >
          <DialogTrigger
            render={
              <Button className="gap-2 shrink-0" />
            }
          >
            <PlusCircle className="h-4 w-4" />
            เพิ่มวิชา
          </DialogTrigger>

          <DialogContent className="w-[calc(100vw-2rem)] max-w-lg overflow-visible">
            <DialogHeader>
              <DialogTitle>
                เพิ่มวิชาใหม่
              </DialogTitle>

              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 min-w-0">
              {/* รหัสวิชา */}
              <div className="grid gap-1.5 min-w-0">
                <Label
                  htmlFor="courseCode"
                  className={
                    isDuplicate
                      ? "text-destructive"
                      : ""
                  }
                >
                  รหัสวิชา
                </Label>

                <Input
                  id="courseCode"
                  placeholder="เช่น CPE303"
                  value={courseCode}
                  onChange={(e) =>
                    setCourseCode(e.target.value)
                  }
                  aria-invalid={isDuplicate}
                  className={
                    isDuplicate
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                />

                {isDuplicate &&
                  courseCode && (
                    <p className="text-sm text-destructive">
                      มีรหัสวิชา{" "}
                      {courseCode.toUpperCase()}{" "}
                      นี้แล้ว
                    </p>
                  )}
              </div>

              {/* ชื่อวิชา */}
              <div className="grid gap-1.5 min-w-0">
                <Label htmlFor="courseTitle">
                  ชื่อวิชา
                </Label>

                <Input
                  id="courseTitle"
                  placeholder="เช่น Mobile Application Development"
                  value={courseTitle}
                  onChange={(e) =>
                    setCourseTitle(e.target.value)
                  }
                />
              </div>

              {/* ผู้สอน */}
              <div className="grid gap-1.5 min-w-0">
                <Label>ผู้สอน</Label>

                <Combobox
                  multiple
                  value={selectedInstructors}
                  onValueChange={(val: any) => {
                    setSelectedInstructors(val);
                    setInputValue("");
                  }}
                >
                  <ComboboxChips
                    ref={anchor}
                    className="w-full min-w-0 max-w-full overflow-hidden"
                  >
                    {selectedInstructors.map(
                      (inst) => (
                        <ComboboxChip
                          key={inst}
                          value={inst}
                          className="max-w-full min-w-0"
                        >
                          <span className="min-w-0 truncate">
                            {inst}
                          </span>
                        </ComboboxChip>
                      )
                    )}

                    <ComboboxChipsInput
                      className="min-w-0 flex-1"
                      placeholder="พิมพ์เพื่อค้นหา หรือเพิ่มผู้สอนใหม่..."
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(
                          e.target.value
                        )
                      }
                    />
                  </ComboboxChips>

                  <ComboboxContent
                    anchor={anchor}
                    className="w-[var(--anchor-width)] max-w-[var(--anchor-width)]"
                  >
                    {filteredInstructors.map(
                      (inst) => (
                        <ComboboxItem
                          key={inst}
                          value={inst}
                        >
                          <span className="truncate">
                            {inst}
                          </span>
                        </ComboboxItem>
                      )
                    )}

                    {inputValue &&
                      !existingInstructors.includes(
                        inputValue
                      ) &&
                      !selectedInstructors.includes(
                        inputValue
                      ) && (
                        <ComboboxItem
                          value={inputValue}
                        >
                          <span className="truncate">
                            + เพิ่มผู้สอน "
                            {inputValue}"
                          </span>
                        </ComboboxItem>
                      )}

                    {!inputValue &&
                      existingInstructors.length ===
                        0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          ยังไม่มีรายชื่อผู้สอน
                        </div>
                      )}
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleAddCourse}
                disabled={
                  isDuplicate ||
                  !courseCode ||
                  !courseTitle
                }
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ตาราง */}
      <div className="rounded-lg border bg-card min-w-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">
                รหัสวิชา
              </TableHead>

              <TableHead>ชื่อวิชา</TableHead>

              <TableHead>ผู้สอน</TableHead>

              <TableHead className="w-[80px] text-right pr-4">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  ยังไม่มีข้อมูลวิชาเรียน
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
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

                  <TableCell className="min-w-0">
                    {course.instructors &&
                    course.instructors.length > 0 ? (
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {course.instructors.map(
                          (inst) => (
                            <Badge
                              key={inst}
                              variant="outline"
                              className="flex items-center gap-1 max-w-full pr-1.5 pl-2.5 py-0.5 bg-blue-500/15 text-blue-600 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                            >
                              <span
                                className="truncate max-w-[180px]"
                                title={inst}
                              >
                                {inst}
                              </span>

                              <button
                                type="button"
                                className="flex items-center justify-center rounded-full p-0.5 hover:bg-blue-500/20 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors shrink-0"
                                onClick={() =>
                                  removeInstructor(
                                    course.courseCode,
                                    inst
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
                        ยังไม่มีผู้สอน
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          />
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ยืนยันการลบวิชา?
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            คุณต้องการลบวิชา{" "}
                            <strong>
                              {course.courseCode}
                            </strong>{" "}
                            ใช่หรือไม่?
                            การกระทำนี้ไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            ยกเลิก
                          </AlertDialogCancel>

                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() =>
                              removeCourse(
                                course.courseCode
                              )
                            }
                          >
                            ลบวิชา
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}