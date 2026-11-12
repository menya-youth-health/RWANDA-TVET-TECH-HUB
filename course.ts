// Course content for the prototype.
//
// IMPORTANT: module titles and lessons here are SAMPLE / PLACEHOLDER content.
// They do not follow the official RTB module list yet. Replace them with the
// real module structure, and have a qualified teacher check every lesson and
// quiz question before students use them.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; text: string };

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  objectives: string[];
  blocks: Block[];
}

export interface Module {
  id: string;
  title: string;
  placeholder: boolean;
  lessons: Lesson[];
}

export const MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Hardware fundamentals',
    placeholder: true,
    lessons: [
      {
        id: 'memory-storage',
        title: 'Memory and storage: what is the difference?',
        minutes: 10,
        objectives: [
          'Explain what RAM does while a computer is running',
          'Explain why data in RAM disappears when the power is off',
          'Tell RAM, permanent storage and firmware apart',
        ],
        blocks: [
          {
            type: 'p',
            text: 'RAM (random access memory) is the computer\'s short-term working memory. The processor keeps the programs and data it is using right now in RAM, because RAM is much faster than a hard drive or an SSD. When the power is switched off, the contents of RAM are lost.',
          },
          {
            type: 'p',
            text: 'Permanent storage keeps your files even when the computer is off. The most common types are the hard disk drive (HDD), which stores data on spinning magnetic disks, and the solid-state drive (SSD), which stores data in flash memory chips and has no moving parts.',
          },
          { type: 'h', text: 'Quick comparison' },
          {
            type: 'ul',
            items: [
              'RAM: very fast, temporary, cleared when power is off.',
              'HDD or SSD: slower than RAM, permanent, keeps data when power is off.',
              'Firmware (ROM): a small chip that holds the startup instructions (BIOS/UEFI). It keeps its contents without power.',
            ],
          },
          {
            type: 'p',
            text: 'A simple picture: RAM is the desk you are working at, and storage is the cupboard where you keep your papers. A bigger desk lets you work on more things at once. A bigger cupboard lets you keep more things.',
          },
        ],
      },
      {
        id: 'main-components',
        title: 'The main parts inside a computer',
        minutes: 12,
        objectives: [
          'Name the main parts inside a desktop computer',
          'State what each part does',
          'Give examples of input and output devices',
        ],
        blocks: [
          {
            type: 'p',
            text: 'A desktop computer is made of several parts that work together. Knowing what each part does helps you find faults.',
          },
          {
            type: 'ul',
            items: [
              'Motherboard: the main circuit board. Every other part connects to it.',
              'CPU (processor): runs program instructions. It is the "brain" of the computer.',
              'RAM: short-term working memory for running programs.',
              'Storage (HDD or SSD): permanent storage for the operating system and files.',
              'Power supply unit (PSU): converts mains electricity (AC) into the low-voltage direct current (DC) that the parts need.',
              'Cooling: a heatsink and fans that remove heat from the CPU and the case.',
              'Graphics: built into the processor, or a separate graphics card, producing the picture for the monitor.',
            ],
          },
          { type: 'h', text: 'Input and output devices' },
          {
            type: 'p',
            text: 'Input devices send information to the computer, for example a keyboard, a mouse or a scanner. Output devices show or produce results, for example a monitor, a printer or speakers.',
          },
        ],
      },
      {
        id: 'boot-process',
        title: 'What happens when you press the power button',
        minutes: 10,
        objectives: [
          'Describe the main steps of the boot process',
          'Explain what POST is and why beep codes matter',
          'Explain what the boot order is',
        ],
        blocks: [
          { type: 'p', text: 'When you press the power button, the computer goes through a fixed sequence before you see the desktop.' },
          {
            type: 'ol',
            items: [
              'The power supply sends power to the motherboard and parts.',
              'The firmware (BIOS or UEFI) starts and runs the POST, the power-on self-test, which checks the CPU, memory and other basic hardware.',
              'If POST finds a problem, the computer may show a message or give a beep pattern.',
              'The firmware looks for a boot device, following the boot order set in the BIOS/UEFI setup.',
              'The boot loader on that device starts the operating system.',
              'The operating system loads and shows the login screen or desktop.',
            ],
          },
          { type: 'h', text: 'BIOS and UEFI' },
          {
            type: 'p',
            text: 'UEFI is the modern replacement for the older BIOS. People often still say "BIOS setup" for both. In the setup screen you can see which drives were detected and change the boot order.',
          },
          { type: 'h', text: 'Beep codes' },
          {
            type: 'p',
            text: 'Beep patterns mean different things on different motherboards. Always look up the code in the manual for that motherboard instead of guessing.',
          },
        ],
      },
      {
        id: 'safe-maintenance',
        title: 'Safe handling and preventive maintenance',
        minutes: 10,
        objectives: [
          'List the safety steps before opening a computer',
          'Explain the difference between preventive and corrective maintenance',
          'Name simple tasks that prevent faults',
        ],
        blocks: [
          { type: 'h', text: 'Safety first' },
          {
            type: 'ul',
            items: [
              'Shut the computer down and unplug the power cable before you open the case.',
              'Discharge static electricity by touching a bare metal part of the case, or use an anti-static wrist strap.',
              'Hold parts by their edges. Do not touch the chips or the gold contacts.',
              'Do not force parts into slots. If something does not fit, check its direction.',
            ],
          },
          { type: 'h', text: 'Preventive and corrective maintenance' },
          {
            type: 'p',
            text: 'Preventive maintenance means doing regular tasks to stop faults from happening. Corrective maintenance means fixing a fault after it has happened.',
          },
          { type: 'h', text: 'Simple preventive tasks' },
          {
            type: 'ul',
            items: [
              'Clean dust from fans and heatsinks regularly with a soft brush or compressed air. Hold fan blades still so they do not spin too fast.',
              'Keep the air vents clear.',
              'Back up important data.',
              'Keep the operating system and programs updated.',
              'Do not let the drive become almost full.',
              'Write down what you change, so you can undo it if needed.',
            ],
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const QUIZ: Question[] = [
  {
    id: 'q1',
    prompt: 'Which part loses its contents when the power is switched off?',
    options: ['RAM', 'An SSD', 'A hard disk drive', 'A USB flash drive'],
    correct: 0,
    explanation: 'RAM is temporary working memory. Storage devices keep their data without power.',
  },
  {
    id: 'q2',
    prompt: 'True or false: an SSD is a type of permanent storage.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'An SSD stores data in flash memory and keeps it when the power is off.',
  },
  {
    id: 'q3',
    prompt: 'Which part converts mains electricity into the low-voltage power the computer needs?',
    options: ['The power supply unit', 'The motherboard', 'The heatsink', 'The CPU'],
    correct: 0,
    explanation: 'The power supply unit (PSU) converts AC mains power into low-voltage DC.',
  },
  {
    id: 'q4',
    prompt: 'What does POST stand for?',
    options: [
      'Power-On Self-Test',
      'Primary Operating System Task',
      'Processor Output Status Test',
      'Power Option Setup Tool',
    ],
    correct: 0,
    explanation: 'POST is the check the firmware runs on basic hardware when the computer starts.',
  },
  {
    id: 'q5',
    prompt: 'True or false: beep codes mean the same thing on every motherboard.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'Beep codes depend on the maker. Always check the manual for that motherboard.',
  },
  {
    id: 'q6',
    prompt: 'What should you do before opening a computer case?',
    options: [
      'Shut it down and unplug the power cable',
      'Leave it running so you can see the fans',
      'Switch off only the monitor',
      'Remove the CPU first',
    ],
    correct: 0,
    explanation: 'Unplugging protects you and the parts. Discharge static before touching parts.',
  },
  {
    id: 'q7',
    prompt:
      'A computer powers on, the screen shows No signal, and the motherboard manual says the repeating beeps mean a memory problem. What is the cheapest first step?',
    options: [
      'Reseat the RAM modules',
      'Replace the motherboard',
      'Buy a new monitor',
      'Reinstall the operating system',
    ],
    correct: 0,
    explanation: 'Reseating RAM costs nothing and often fixes memory that is not seated properly.',
  },
  {
    id: 'q8',
    prompt: 'True or false: preventive maintenance means fixing a fault after it has happened.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'That is corrective maintenance. Preventive maintenance stops faults from happening.',
  },
];
