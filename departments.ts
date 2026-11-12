// Department information for the prototype.
//
// IMPORTANT: this is a DRAFT OUTLINE written to show how each department could be
// organised. It does not follow the official RTB curriculum or module list, and
// it has not been checked by a teacher. Replace it with the real module list and
// have a qualified teacher verify it before classroom use.

export interface Department {
  id: string;
  name: string;
  summary: string;
  live: boolean;
  courseId?: string;
  overview: string;
  topics: string[];
  skills: string[];
  tools: string[];
  safety: string;
  outline: string[];
  after: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'computer-systems',
    name: 'Computer Systems and Maintenance',
    summary:
      'Hardware, assembly, BIOS/UEFI, operating system installation, troubleshooting and preventive maintenance.',
    live: true,
    courseId: 'computer-systems',
    overview:
      'Students learn how a computer is built, how it starts up, how to find the cause of a fault, and how to look after equipment so that it keeps working. This was the first department built in this prototype.',
    topics: [
      'Main parts of a computer and what each one does',
      'Memory and storage',
      'What happens when a computer starts (power, BIOS/UEFI, boot)',
      'Safe handling and preventive maintenance',
      'Finding faults step by step',
      'Installing and setting up an operating system',
    ],
    skills: [
      'Identify and describe computer components',
      'Follow safety rules when working on equipment',
      'Diagnose a fault by checking simple things first',
      'Replace a part only when the evidence points to it',
      'Record what was found and what was done',
    ],
    tools: ['Screwdrivers', 'Anti-static wrist strap', 'Multimeter', 'Bootable USB drive', 'Cleaning brush and air blower'],
    safety:
      'Switch off and unplug equipment before opening it. Never open a power supply unit. Work under teacher supervision on real hardware.',
    outline: [
      'Hardware fundamentals (available in this prototype)',
      'Operating system installation and setup',
      'Troubleshooting method and record keeping',
      'Preventive maintenance and care of equipment',
    ],
    after: ['Computer technician or support assistant', 'Further study in networking or software'],
  },
  {
    id: 'software-development',
    name: 'Software Development (SOD)',
    summary: 'Programming, web development, databases, testing and version control.',
    live: true,
    courseId: 'software-development',
    overview:
      'Students learn to solve problems by writing programs. They begin with the ideas that every language shares, then build for the web, store data in a database, and learn the habits of testing and teamwork that professional developers use.',
    topics: [
      'What software development is and its main stages',
      'Variables, decisions, loops and functions',
      'Web pages with HTML, CSS and JavaScript',
      'Databases and SQL',
      'Testing and debugging',
      'Version control with Git',
    ],
    skills: [
      'Break a problem into small steps and write code for each step',
      'Read and write simple programs',
      'Build a simple web page',
      'Read and write basic SQL queries',
      'Find and fix bugs',
      'Save work with Git commits',
    ],
    tools: ['Laptop or desktop', 'Code editor such as Visual Studio Code', 'Web browser', 'Git', 'A free database for practice'],
    safety:
      'Take regular breaks to rest your eyes and back. Never put passwords or secret keys in code that you share. Keep backups of your work.',
    outline: [
      'Programming fundamentals (available in this prototype)',
      'Web, data and teamwork (available in this prototype)',
      'Building a small project from start to finish',
      'Working with APIs and simple back-end services',
    ],
    after: ['Junior or assistant software developer', 'Web developer', 'Further study in computer science or software engineering'],
  },
  {
    id: 'networking-security',
    name: 'Networking and Cybersecurity',
    summary: 'Addressing, routing, switching and defensive security basics.',
    live: true,
    courseId: 'networking',
    overview:
      'Students learn how computers find each other and exchange data on a network, how to set up a small network, and how to protect people and equipment from common threats.',
    topics: [
      'What a network is and the parts it is made of',
      'IP addresses, subnets and DNS',
      'Switches, routers and wireless access points',
      'Cabling and testing a connection',
      'Common threats: weak passwords, phishing, malware',
      'Defensive habits: updates, backups and least privilege',
    ],
    skills: [
      'Make and test a network cable',
      'Configure an address on a device',
      'Check a connection with ping',
      'Explain how to protect an account and a device',
    ],
    tools: ['Cable tester and crimping tool', 'Switch and router', 'Laptop', 'Network simulator program'],
    safety:
      'Test only networks you own or have written permission to use. Never try to access other people\'s accounts or systems.',
    outline: [
      'Network fundamentals (available in this prototype)',
      'Addressing and DNS',
      'Switching, routing and wireless',
      'Cabling and testing',
      'Security basics',
    ],
    after: ['Network support assistant', 'Further study in cybersecurity'],
  },
  {
    id: 'embedded-electronics',
    name: 'Embedded Systems and Electronics',
    summary: 'Circuits, microcontrollers, Arduino and ESP32.',
    live: false,
    overview:
      'Students learn how electricity behaves in simple circuits, how to read basic components, and how a small computer on a chip (a microcontroller) can read sensors and control outputs.',
    topics: [
      'Voltage, current and resistance',
      'Resistors, LEDs, switches and capacitors',
      'Reading a circuit diagram',
      'Using a breadboard and a multimeter',
      'Digital inputs and outputs',
      'Programming a microcontroller (Arduino and ESP32)',
    ],
    skills: [
      'Build a simple circuit from a diagram',
      'Measure voltage and continuity with a multimeter',
      'Write and upload a short program to a microcontroller',
      'Find a wiring mistake by testing step by step',
    ],
    tools: ['Breadboard', 'Multimeter', 'Arduino or ESP32 board', 'Jumper wires', 'Resistors and LEDs'],
    safety:
      'Keep to low-voltage practice circuits. Never work on mains electricity. Check polarity before connecting a battery or power supply.',
    outline: [
      'Electricity and simple circuits',
      'Components and circuit diagrams',
      'Measuring with a multimeter',
      'Introduction to microcontrollers',
      'First programs: LEDs, buttons and sensors',
    ],
    after: ['Electronics assistant', 'Further study in IoT or robotics'],
  },
  {
    id: 'iot',
    name: 'Internet of Things',
    summary: 'Sensors, wireless communication, MQTT and monitoring dashboards.',
    live: false,
    overview:
      'Students connect small devices to sensors and to a network, send readings to a server, and show them on a simple dashboard. It builds on the Embedded Systems and Electronics department.',
    topics: [
      'What an IoT system is: sensor, device, network, server, dashboard',
      'Common sensors (temperature, humidity, light, motion)',
      'Wi-Fi and other wireless links',
      'Sending data with MQTT',
      'Storing and displaying readings',
      'Keeping devices and data secure',
    ],
    skills: [
      'Read a sensor with a microcontroller',
      'Send readings over Wi-Fi',
      'Show readings on a dashboard',
      'Explain the risks of an insecure device',
    ],
    tools: ['ESP32 board', 'Sensors', 'Wi-Fi network', 'Free MQTT broker for practice', 'Laptop'],
    safety:
      'Never put passwords or private keys in code you share. Change default passwords on devices. Test only on your own equipment and network.',
    outline: [
      'IoT system overview',
      'Sensors and data',
      'Connecting devices to a network',
      'MQTT and dashboards',
      'Small project: a monitoring station',
    ],
    after: ['IoT assistant technician', 'Further study in networking or cybersecurity'],
  },
  {
    id: 'os-servers',
    name: 'Operating Systems and Server Administration',
    summary: 'Processes, memory, Linux, virtualization and server administration.',
    live: false,
    overview:
      'Students learn what an operating system does, how to work confidently on the Linux command line, and how to set up and look after a simple server.',
    topics: [
      'Role of the operating system: processes, memory, files and devices',
      'Files, folders and permissions',
      'Using the Linux command line',
      'Users, services and software packages',
      'Virtual machines',
      'Backups and basic server care',
    ],
    skills: [
      'Move around and manage files in a terminal',
      'Set file permissions correctly',
      'Install and update software',
      'Create a virtual machine for practice',
      'Make and restore a backup',
    ],
    tools: ['Laptop or desktop', 'A virtual machine program', 'A Linux distribution image'],
    safety:
      'Practise destructive commands only inside a virtual machine. Keep backups before changing anything important.',
    outline: [
      'How an operating system works',
      'Linux command line basics',
      'Users, permissions and services',
      'Virtual machines',
      'Backups and maintenance',
    ],
    after: ['Systems support technician', 'Further study in cloud or server administration'],
  },
  {
    id: 'robotics',
    name: 'Robotics and Engineering Innovation',
    summary: 'Motors, sensors, automation and student projects.',
    live: false,
    overview:
      'Students put electronics, programming and mechanics together to build small machines that sense and move, and learn to plan, build, test and present a project.',
    topics: [
      'Parts of a robot: controller, sensors, motors and power',
      'DC motors, servo motors and motor drivers',
      'Reading sensors to make decisions',
      'Simple automation and control',
      'Planning and documenting a project',
      'Teamwork and presenting results',
    ],
    skills: [
      'Wire and drive a motor safely',
      'Use a sensor to change a robot\'s behaviour',
      'Test and improve a design',
      'Present a project with a clear explanation',
    ],
    tools: ['Microcontroller board', 'Motor driver', 'Motors and wheels', 'Distance sensor', 'Battery pack'],
    safety:
      'Keep fingers away from moving parts. Disconnect the battery before changing wiring. Use the correct battery type and never short-circuit it.',
    outline: [
      'Parts of a robot',
      'Motors and drivers',
      'Sensing and decisions',
      'Project: build and test a small robot',
    ],
    after: ['Engineering assistant', 'Further study in automation or mechatronics'],
  },
];

export const DEPARTMENTS_BY_ID: Record<string, Department> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.id, d]),
);
