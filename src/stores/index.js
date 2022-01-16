
import { createSortableListStore, createStateStore, deriveInherit } from "./base_stores"
import { v4 as uuidv4 } from "uuid";
import { derived, writable } from "svelte/store"
import { getSectionByIndex } from "../gradeCalculator";

const default_lines = {
  sections: {
    width: 0.9,
    style: "none",
    color: "#666666",
    cap: "round"
  },
  parts: {
    width: 0.7,
    style: "none",
    color: "#999999",
    cap: "round"
  },
  grades: {
    width: 0.7,
    style: "none",
    color: "#999999",
    cap: "round"
  }
}
export const lines = createStateStore(default_lines)

const default_textoptions = {
  sections: {
    title: "Sections",
    readonly: false,
    name: "Student name",
    value: "<name>",
    xpos: 0,
    ypos: 5,
    size: 14,
    weight: 200,
    angle: 0,
    anchor: "middle",
    color: "#000000",
    curve: "normal",
    flip: "none"
  },
  parts: {
    title: "Parts",
    readonly: false,
    name: "Student name",
    value: "<name>",
    xpos: 0,
    ypos: 0,
    size: 9,
    weight: 400,
    angle: 0,
    anchor: "middle",
    color: "#000000",
    curve: "normal",
    flip: "none"
  },
  grades: {
    title: "Grades",
    readonly: false,
    name: "Student name",
    value: "<name>",
    xpos: 0,
    ypos: 30,
    size: 6,
    weight: 400,
    angle: 0,
    anchor: "middle",
    color: "#000000",
    curve: "normal",
    flip: "none"
  }
}
export const textoptions = createStateStore(default_textoptions)

const default_grades = [
  { key: "1", color: "#ff8ba7", name: "Can Better" },
  { key: "2", color: "#ffc6c7", name: "Fine" },
  { key: "3", color: "#c3f0ca", name: "Good" },
  { key: "4", color: "#abd1c6", name: "Super" }
];
const new_grade = (_) => ({ key: uuidv4(), color: "#eeeeee", name: "" })
export const grades = createSortableListStore(default_grades, new_grade)

const default_labels = [
  {
    key: "__name__",
    readonly: true,
    name: "Student name",
    value: "Not used",
    xpos: 0,
    ypos: -145,
    size: 18,
    weight: 600,
    angle: 0,
    anchor: "middle",
    color: "#000000"
  },
  {
    key: uuidv4(),
    readonly: false,
    name: "Course",
    value: "Mathematics",
    xpos: 0,
    ypos: -130,
    size: 12,
    weight: 200,
    angle: 0,
    anchor: "middle",
    color: "#000000"
  },
  {
    key: uuidv4(),
    readonly: false,
    name: "Copyright",
    value: "Created with Rosette (https://rosette.azurewebsites.net)",
    xpos: -120,
    ypos: 115,
    size: 3,
    weight: 400,
    angle: 0,
    anchor: "left",
    color: "#000000"
  }
];
const new_label = () => ({
  key: uuidv4(),
  readonly: false,
  name: "<name>",
  value: "<value>",
  xpos: 0,
  ypos: 120,
  size: 12,
  weight: 400,
  angle: 0,
  anchor: "middle"
})
export const labels = createSortableListStore(default_labels, new_label)

const default_spaces = [2, 1, 1, 1, 0.7, 0.3].map(number => ({ key: uuidv4(), number }));
const new_space = (_) => ({ key: uuidv4(), number: 1 })
export const spaces = createSortableListStore(default_spaces, new_space)

const default_layout = {
  size_x: 250,
  size_y: 290,
  center_x: 125,
  center_y: 170,
  papersize: "a4",
  angleoffset: -1.5,
  png_height: 2048,
  png_width: 2048,
  pdf_height: 500
};
export const layout = createStateStore(default_layout)


function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randElement(arr) {
  return arr[randInt(0, arr.length - 1)]
}

function generateName() {
  const firstname = ['Daan', 'John', 'Frans', 'Els', 'Olivia', 'Emma', 'Ava', 'Thura', 'Liam', 'Noah', 'Henry', 'Jehanzaib', 'Hamdiya', 'Aabroo', 'Lucas', 'Elija', 'Harper', 'Yassin', 'Mohamed', 'Fatma', 'Nada', 'Mike', 'Martin', 'Ralf', 'Oscar', 'Romeo']
  const lastname = ['De man', 'Beko', 'Michielsen', 'Johnson', 'Hasanov', 'Anderson', 'Khim', 'Baumgartner', "O'Brien", 'Moretti', 'Козловский', 'Brown', 'Chávez', 'Cruz', 'Rojas', 'García', 'Iglesias']
  return randElement(firstname) + ' ' + randElement(lastname)
}

function generateStudents(n) {
  return Array.from({length: n}).map(_ => ({
    key: uuidv4(),
    name: generateName(),
  }))
}

const default_students = generateStudents(randInt(4,8))
const new_student = (student) => ({
  name: '',
  ...student,
  key: uuidv4(),
})
export const students = createSortableListStore(default_students, new_student)


const default_sections = [
  {
    key: uuidv4(),
    name: "Science",
    parts: [
      {
        key: uuidv4(),
        name: "Fysics",
        scores: ["", 2, 3, 2],
        tbs: 0,
        threshold: 0
      },
      {
        key: uuidv4(),
        name: "Biology",
        scores: [1, 2, 2, 3],
        tbs: 0,
        threshold: 0
      },
      {
        key: uuidv4(),
        name: "Chemistry",
        scores: [4, 2, 3, 1],
        tbs: 0,
        threshold: 0
      }
    ]
  },
  {
    key: uuidv4(),
    name: "Languages",
    parts: [
      {
        key: uuidv4(),
        name: "French",
        scores: [1, 2, 3, 4],
        tbs: 0,
        threshold: 0
      },
      {
        key: uuidv4(),
        name: "English",
        scores: [1, 2, 3, 1],
        tbs: 0,
        threshold: 0
      },
      {
        key: uuidv4(),
        name: "German",
        scores: [1, 2, 3, 2],
        tbs: 0,
        threshold: 0
      }
    ]
  }
];
const new_section = (data) => {

  if (data === undefined || data === 'section') return {
    key: uuidv4(),
    name: "<new section>",
    parts: []
  }

  if (data === 'part')
    return {
      key: uuidv4(),
      name: "<new part>",
      scores: [],
      tbs: 0,
      threshold: 0
    }

  return data


}
export const sections = createSortableListStore(default_sections, new_section)

let dataoptions = {
  mode: "simple",
  thresholds: [0.5, 0.7, 0.9],
  importoptions: {}
};



function resultKey(student_key, part_key) {
  return student_key + '_' + part_key
}


function addScoreToPart(part, students, scores) {
  return {
    ...part,
    scores: students.map(student => {
      const score = scores[resultKey(student.key, part.key)]
      return {
        value: score === undefined ? '' : score,
        student,
      }
    })
  }
}

function resultsStore([base, students, sections]) {

  return sections.map(section => ({
    ...section,
    parts: section.parts.map(part => addScoreToPart(part, students, base, base))
  }))
}

function createResultBaseStore(default_values = {}) {

  const { update, subscribe } = writable(default_values)

  function setValue(state, student_key, part_key, value) {
    state[resultKey(student_key, part_key)] = value
    return state
  }

  return {
    subscribe,
    set_result: (student_key, part_key, value) => update(state => setValue(state, student_key, part_key, value)),
    handleUpdate: (student_key, part_key) => event => update(state => setValue(state, student_key, part_key, event.target?.value || event.detail.value)),
  }
}

const default_results = {}
for (let section of default_sections) {
  for (let student of default_students) {
    for (const part of section.parts) {
      default_results[resultKey(student.key, part.key)] = randInt(1,4)
    }
  }
}

const baseResultsStore = createResultBaseStore(default_results)

export const results = deriveInherit(baseResultsStore, [students, sections], resultsStore, [])

function rosettesStore([students, sections, labels]) {
  const rosettes = students.map((student, index) => ({
    sections: getSectionByIndex(sections, index, dataoptions),
    labels: labels.map(label => {
      if (label.key === "__name__") return { ...label, value: student.name };
      else return label;
    }),
    key: student.key
  }));
  return rosettes
}

export const rosettes = derived([students, results, labels], rosettesStore, [])