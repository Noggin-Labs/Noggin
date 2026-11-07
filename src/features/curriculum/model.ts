import { Activity, BookOpen, Compass, FlaskConical, Layers3, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  level: string;
  intro: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type CourseTheme = "blue" | "violet" | "green" | "amber" | "coral" | "pink";

export type Course = {
  id: string;
  subject: string;
  level: string;
  title: string;
  description: string;
  lessonIds: string[];
  theme: CourseTheme;
  icon: LucideIcon;
};

export const lessons: Lesson[] = [
  { id:"fractions", courseId:"fractions-course", title:"What Exactly is a Fraction?", subject:"Mathematics", level:"Beginner", intro:"A fraction describes equal parts of one whole. Imagine sharing a pizza fairly: the denominator tells us how many equal slices make the whole, and the numerator tells us how many slices we have.", question:"A pizza is cut into 4 equal slices. You take 1 slice. What fraction did you take?", options:["1/2","1/3","1/4","4/1"], answer:"1/4", explanation:"There are 4 equal slices in the whole pizza, and you took 1. That is 1 out of 4, or one quarter." },
  { id:"equivalent-fractions", courseId:"fractions-course", title:"Fractions That Look Different", subject:"Mathematics", level:"Beginner", intro:"Two fractions can look different but represent the same amount. One half and two quarters cover exactly the same portion of a whole.", question:"Which fraction is equivalent to 1/2?", options:["1/3","2/4","3/4","2/3"], answer:"2/4", explanation:"If you split each half into two equal pieces, you get four pieces in total. Two of those four pieces make the same half." },
  { id:"algebra-balance", courseId:"algebra-course", title:"The Balance of an Equation", subject:"Mathematics", level:"Intermediate", intro:"An equation is like a balanced scale. Whatever you do to one side, you must also do to the other side to keep it balanced.", question:"If x + 3 = 8, what is x?", options:["3","5","8","11"], answer:"5", explanation:"Subtract 3 from both sides: x + 3 − 3 = 8 − 3, so x = 5." },
  { id:"photosynthesis", courseId:"photosynthesis-course", title:"How Plants Capture Sunlight", subject:"Science", level:"Beginner", intro:"Plants use energy from sunlight to help turn water and carbon dioxide into glucose. This process is called photosynthesis. Oxygen is released along the way.", question:"Which source provides the energy for photosynthesis?", options:["Moonlight","Sunlight","Soil","Wind"], answer:"Sunlight", explanation:"Light energy from the Sun powers photosynthesis. Leaves capture this energy using chlorophyll." },
  { id:"circuits", courseId:"circuits-course", title:"A Complete Electric Circuit", subject:"Science", level:"Beginner", intro:"Electric current flows around a complete path called a circuit. A battery provides energy, wires connect the components, and a closed switch completes the path.", question:"What must happen for a simple circuit to work?", options:["The switch must be open","The path must be complete","The wires must be disconnected","The battery must be removed"], answer:"The path must be complete", explanation:"Current needs a continuous, closed path from one battery terminal through the components and back to the other terminal." },
  { id:"phonics", courseId:"english-course", title:"Hear the Parts in a Word", subject:"English", level:"Beginner", intro:"Words are made from sounds called phonemes. Listening for the individual sounds in a word can help us connect spoken language to letters.", question:"How many sounds are in the spoken word “ship”?", options:["2","3","4","5"], answer:"3", explanation:"Ship has three phonemes: /sh/ /i/ /p/. The letters s and h work together to represent the first sound." },
  { id:"emotion-compass", courseId:"sel-course", title:"Name It to Understand It", subject:"Life skills", level:"Beginner", intro:"Emotions are information, not instructions. Giving a feeling a name can help us understand what we might need next. Different people experience feelings differently.", question:"Which is a useful first step when a feeling seems confusing?", options:["Ignore it","Name the feeling without judging it","Assume it will never change","Compare it with someone else's"], answer:"Name the feeling without judging it", explanation:"Naming a feeling with curiosity can make it easier to decide what support or next step might help. There is no single correct way to feel." }
];

export const courses: Course[] = [
  { id:"fractions-course", subject:"Mathematics", level:"Beginner", title:"Visual Fractions & Proportions", description:"See fractions as parts of a whole through visual models, sharing and equivalent amounts.", lessonIds:["fractions","equivalent-fractions"], theme:"blue", icon:Layers3 },
  { id:"algebra-course", subject:"Mathematics", level:"Intermediate", title:"Algebraic Balances & Unknowns", description:"Explore equations as balanced relationships and discover what an unknown value means.", lessonIds:["algebra-balance"], theme:"violet", icon:Activity },
  { id:"photosynthesis-course", subject:"Science", level:"Beginner", title:"Photosynthesis & Solar Energy", description:"Follow the journey from sunlight, water and carbon dioxide to plant-made sugars.", lessonIds:["photosynthesis"], theme:"green", icon:FlaskConical },
  { id:"circuits-course", subject:"Science", level:"Beginner", title:"Electric Circuits & Electrons", description:"Explore batteries, switches and the idea of a complete path for electric current.", lessonIds:["circuits"], theme:"amber", icon:Zap },
  { id:"english-course", subject:"English", level:"Beginner", title:"Phonics & Word Crafting", description:"Listen closely to sounds, syllables and the building blocks of written words.", lessonIds:["phonics"], theme:"coral", icon:BookOpen },
  { id:"sel-course", subject:"Life skills", level:"Beginner", title:"The Emotion Compass", description:"Build a vocabulary for feelings and explore thoughtful ways to respond to them.", lessonIds:["emotion-compass"], theme:"pink", icon:Compass }
];
