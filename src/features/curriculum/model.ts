import { Activity, BookOpen, Compass, FlaskConical, Layers3, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  subject: string;
  level: string;
  intro: string;
  objective: string;
  workedExample: { label: string; steps: string[]; takeaway: string };
  commonMistake: string;
  reflection: string;
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
  {
    id:"fractions", courseId:"fractions-course", title:"Fractions are numbers, not just slices", subject:"Mathematics", level:"Beginner",
    intro:"A fraction tells us how much of a quantity we have when that quantity is split into equal-sized parts. The denominator names the size of the parts; the numerator counts how many of those parts we are talking about.",
    objective:"By the end, you should be able to read a fraction as a count of equal parts and explain what its numerator and denominator mean.",
    workedExample:{label:"Read 3/5",steps:["The denominator, 5, says the whole is partitioned into five equal parts.","The numerator, 3, says we are considering three of those parts.","So 3/5 means three parts, each one-fifth of the original whole."],takeaway:"A fraction is a number describing a quantity. The parts must be equal in size."},
    commonMistake:"Counting the number of pieces without checking whether the pieces are equal. Five unequal pieces do not each represent one-fifth.",
    reflection:"If the same whole were divided into ten equal parts, how many parts would represent the same amount as 1/2?",
    question:"A ribbon is divided into 8 equal lengths. You use 3 lengths. Which fraction of the ribbon did you use?",
    options:["3/8","8/3","1/8","3/5"],answer:"3/8",
    explanation:"There are eight equal parts in the whole ribbon, and three are used. The denominator is 8 and the numerator is 3, so the fraction is 3/8."
  },
  {
    id:"equivalent-fractions",courseId:"fractions-course",title:"Different names, same amount",subject:"Mathematics",level:"Beginner",
    intro:"Equivalent fractions are different ways to name the same number. Multiplying or dividing the numerator and denominator by the same non-zero number changes the way a fraction is written, but not its value.",
    objective:"Recognise equivalent fractions and justify why scaling the top and bottom by the same factor preserves value.",
    workedExample:{label:"Why 1/2 = 2/4",steps:["Start with one-half: one part out of two equal parts.","Split each half into two equal smaller parts. The whole now has four parts.","The original half contains two of the four smaller parts, so it is 2/4."],takeaway:"Multiplying numerator and denominator by 2 gives 1×2 / 2×2 = 2/4. The value stays the same."},
    commonMistake:"Changing only the numerator or only the denominator. Both must be scaled by the same factor to preserve the ratio.",
    reflection:"Write two fractions equivalent to 3/4. What operation did you apply to both numbers?",
    question:"Which fraction is equivalent to 3/5?",
    options:["6/10","3/10","9/10","5/3"],answer:"6/10",
    explanation:"Multiplying both parts of 3/5 by 2 gives 6/10. The ratio is unchanged, so the fractions are equivalent."
  },
  {
    id:"algebra-balance",courseId:"algebra-course",title:"Keep an equation in balance",subject:"Mathematics",level:"Intermediate",
    intro:"An equation states that two expressions have the same value. Solving an equation means finding the value of the unknown that makes that statement true. Whatever operation keeps one side balanced must also be applied to the other.",
    objective:"Solve a one-step linear equation and explain why the same operation is applied to both sides.",
    workedExample:{label:"Solve x + 4 = 11",steps:["The unknown has 4 added to it.","Undo adding 4 by subtracting 4 from both sides: x + 4 − 4 = 11 − 4.","This leaves x = 7. Check: 7 + 4 really is 11."],takeaway:"Use inverse operations on both sides. Then substitute your answer to check it."},
    commonMistake:"Moving a number across the equals sign and changing its sign without understanding the operation. Think about what is being done to both sides.",
    reflection:"How would you solve x − 6 = 13? Which operation undoes subtracting 6?",
    question:"Solve 3x = 21. What value of x makes the equation true?",
    options:["6","7","18","24"],answer:"7",
    explanation:"Divide both sides by 3: 3x ÷ 3 = 21 ÷ 3, so x = 7. Checking gives 3 × 7 = 21."
  },
  {
    id:"photosynthesis",courseId:"photosynthesis-course",title:"How a leaf builds sugar",subject:"Science",level:"Beginner",
    intro:"Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored in sugars. In plants, chlorophyll in chloroplasts absorbs light. Water and carbon dioxide are used, and oxygen is released.",
    objective:"Identify the energy source and the main raw materials involved in photosynthesis.",
    workedExample:{label:"Follow the inputs and outputs",steps:["Light provides the energy for the process.","Roots absorb water, which travels to the leaves.","Carbon dioxide enters the leaf from the air.","The plant makes sugars and releases oxygen."],takeaway:"Carbon dioxide + water + light energy → sugars + oxygen (simplified summary)."},
    commonMistake:"Saying plants get their food from soil. Soil supplies minerals and supports the plant, but the plant builds sugars using carbon dioxide and water.",
    reflection:"Why might a plant kept in darkness for a long time struggle to make enough sugar?",
    question:"Which input supplies the energy that drives photosynthesis?",
    options:["Sunlight","Mineral salts","Oxygen","Wind"],answer:"Sunlight",
    explanation:"Light energy is absorbed by pigments such as chlorophyll and drives the reactions that store energy in sugars."
  },
  {
    id:"circuits",courseId:"circuits-course",title:"A circuit needs a complete route",subject:"Science",level:"Beginner",
    intro:"A simple electric circuit is a connected path that allows charge to move. A cell or battery provides a potential difference, wires connect components, and a closed switch completes the route. If the path is broken, a steady current cannot flow.",
    objective:"Explain the difference between an open and closed circuit and predict what happens when the path is broken.",
    workedExample:{label:"Trace a lamp circuit",steps:["Start at one terminal of the cell.","Follow the wire through the lamp and the closed switch.","Return to the other terminal of the cell.","Open the switch and the path is broken, so the lamp goes out."],takeaway:"A working simple circuit needs a continuous conducting loop."},
    commonMistake:"Thinking current is used up by the first component. In a simple series circuit, the current is the same at every point in the loop.",
    reflection:"What would happen to the lamp if one wire became disconnected? Explain using the idea of a complete path.",
    question:"What must be true for a simple battery-and-lamp circuit to carry a steady current?",
    options:["The circuit forms a complete conducting loop","The switch is always open","One wire is disconnected","The battery is outside the circuit"],answer:"The circuit forms a complete conducting loop",
    explanation:"Charge needs a continuous conducting path around the circuit. A gap, such as an open switch, interrupts that path."
  },
  {
    id:"phonics",courseId:"english-course",title:"One sound can use two letters",subject:"English",level:"Beginner",
    intro:"A phoneme is a speech sound that can distinguish one word from another. A grapheme is a letter or group of letters used to represent a sound. The number of letters in a word is not always the number of sounds.",
    objective:"Distinguish letters from speech sounds and identify a digraph that represents one phoneme.",
    workedExample:{label:"Listen to the word ship",steps:["The word is written with four letters: s, h, i, p.","The letters s and h work together as the digraph sh.","The spoken sounds are /sh/, /i/, /p/ — three phonemes."],takeaway:"Count the sounds you hear, not simply the letters you see."},
    commonMistake:"Counting s and h as two separate sounds in ship. Together, they represent one sound.",
    reflection:"How many phonemes do you hear in chat? Which letters work together?",
    question:"How many phonemes are in the spoken word “ship”?",
    options:["2","3","4","5"],answer:"3",
    explanation:"Ship has three phonemes: /sh/ /i/ /p/. The two letters s and h represent the first single sound."
  },
  {
    id:"emotion-compass",courseId:"sel-course",title:"Put a name to the feeling",subject:"Life skills",level:"Beginner",
    intro:"Emotions can provide clues about what matters to us or what is happening around us. Naming a feeling is one way to pause and understand it. People may describe the same situation differently, and there is no single correct way to feel.",
    objective:"Practise describing an emotion without judging it and consider what information it might provide.",
    workedExample:{label:"From reaction to reflection",steps:["Notice what you are experiencing without rushing to change it.","Choose a word that seems close, such as frustrated, relieved, uncertain, or excited.","Ask what happened just before the feeling appeared.","Consider whether you need information, a break, help, or another response."],takeaway:"An emotion can be useful information, but it does not have to dictate what you do next."},
    commonMistake:"Assuming a feeling is wrong, or assuming everyone should react the same way. Feelings vary; respectful curiosity is more useful than judgement.",
    reflection:"Think of a low-stakes everyday moment. What word might describe how you felt, and what clue helped you choose it?",
    question:"Which is a useful first step when a feeling seems confusing?",
    options:["Ignore it","Name the feeling without judging it","Assume it will never change","Compare it with someone else's"],answer:"Name the feeling without judging it",
    explanation:"Naming a feeling with curiosity can make it easier to decide what support or next step might help. There is no single correct way to feel."
  }
];

export const courses: Course[] = [
  {id:"fractions-course",subject:"Mathematics",level:"Beginner",title:"Fractions & proportional thinking",description:"Build a reliable sense of fractions, equivalence, and the relationships behind ratios.",lessonIds:["fractions","equivalent-fractions"],theme:"blue",icon:Layers3},
  {id:"algebra-course",subject:"Mathematics",level:"Intermediate",title:"Equations & the balance principle",description:"Use inverse operations and mathematical reasoning to uncover unknown values.",lessonIds:["algebra-balance"],theme:"violet",icon:Activity},
  {id:"photosynthesis-course",subject:"Science",level:"Beginner",title:"Photosynthesis: energy into matter",description:"Trace how light energy helps plants build sugars from simple raw materials.",lessonIds:["photosynthesis"],theme:"green",icon:FlaskConical},
  {id:"circuits-course",subject:"Science",level:"Beginner",title:"Electricity: paths and circuits",description:"Model complete circuits, current, and the role of each component.",lessonIds:["circuits"],theme:"amber",icon:Zap},
  {id:"english-course",subject:"English",level:"Beginner",title:"Phonemes, graphemes & word craft",description:"Explore how speech sounds connect to letters and spelling patterns.",lessonIds:["phonics"],theme:"coral",icon:BookOpen},
  {id:"sel-course",subject:"Life skills",level:"Beginner",title:"Emotional vocabulary & reflection",description:"Build language for feelings and practise responding with thoughtful curiosity.",lessonIds:["emotion-compass"],theme:"pink",icon:Compass}
];
