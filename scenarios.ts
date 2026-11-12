// Scenario data for the PC Troubleshooting Simulator.
//
// To add a new scenario, copy one of the objects in SCENARIOS and change the
// text. No other code needs to change. Keep every action id in `responses`,
// `fixActions` and `idealPath` equal to an id in ACTIONS (the tests check this).
//
// IMPORTANT: this content is sample teaching material. A qualified teacher
// must review every scenario before students use it.

export type ActionGroup =
  | 'Safety'
  | 'Check from outside'
  | 'Software and BIOS'
  | 'Inside the case'
  | 'Fix or replace'
  | 'Test';

export interface LabAction {
  id: string;
  label: string;
  group: ActionGroup;
  /** Needs the case to be open first (and power unplugged for safety). */
  needsCase?: boolean;
  /** Swapping a part. Counts as an unnecessary cost unless it is the real fix. */
  replacement?: boolean;
  /** Needs a working display or operating system. */
  software?: boolean;
}

export const GROUP_ORDER: ActionGroup[] = [
  'Safety',
  'Check from outside',
  'Software and BIOS',
  'Inside the case',
  'Fix or replace',
  'Test',
];

export const ACTIONS: LabAction[] = [
  { id: 'unplug', label: 'Unplug the power cable', group: 'Safety' },
  { id: 'plug', label: 'Plug the power cable back in', group: 'Safety' },
  { id: 'open_case', label: 'Open the case', group: 'Safety' },

  { id: 'check_power_cable', label: 'Check the power cable and wall socket', group: 'Check from outside' },
  { id: 'check_leds', label: 'Look at the power light and listen to the fans', group: 'Check from outside' },
  { id: 'check_monitor', label: 'Check the monitor and its cable', group: 'Check from outside' },
  { id: 'listen_beeps', label: 'Listen for beep codes', group: 'Check from outside' },
  { id: 'read_screen', label: 'Read what the screen shows', group: 'Check from outside' },

  { id: 'open_bios', label: 'Enter BIOS/UEFI setup', group: 'Software and BIOS', software: true },
  { id: 'check_temps', label: 'Check the CPU temperature', group: 'Software and BIOS', software: true },
  { id: 'run_memtest', label: 'Run a memory test', group: 'Software and BIOS', software: true },
  { id: 'run_disk_check', label: 'Run a disk health check', group: 'Software and BIOS', software: true },
  { id: 'check_startup', label: 'Check startup programs and free disk space', group: 'Software and BIOS', software: true },

  { id: 'inspect_ram', label: 'Inspect the RAM modules', group: 'Inside the case', needsCase: true },
  { id: 'test_ram_modules', label: 'Test each RAM module on its own', group: 'Inside the case', needsCase: true },
  { id: 'inspect_psu_connections', label: 'Inspect the power supply connectors', group: 'Inside the case', needsCase: true },
  { id: 'check_drive_cables', label: 'Check the drive data and power cables', group: 'Inside the case', needsCase: true },
  { id: 'inspect_cooling', label: 'Inspect the CPU fan and heatsink', group: 'Inside the case', needsCase: true },

  { id: 'reseat_power_cable', label: 'Push the power cable firmly into the power supply', group: 'Fix or replace' },
  { id: 'reseat_ram', label: 'Reseat the RAM modules', group: 'Fix or replace', needsCase: true },
  { id: 'reseat_drive_cables', label: 'Reseat the drive cables', group: 'Fix or replace', needsCase: true },
  { id: 'clean_cooling', label: 'Clean the dust from the fan and heatsink', group: 'Fix or replace', needsCase: true },
  { id: 'change_boot_order', label: 'Change the boot order in BIOS', group: 'Fix or replace', software: true },
  { id: 'clean_startup', label: 'Disable unneeded startup programs and free disk space', group: 'Fix or replace', software: true },
  { id: 'replace_ram', label: 'Replace a RAM module', group: 'Fix or replace', needsCase: true, replacement: true },
  { id: 'replace_drive', label: 'Replace the hard drive or SSD', group: 'Fix or replace', needsCase: true, replacement: true },
  { id: 'replace_psu', label: 'Replace the power supply', group: 'Fix or replace', needsCase: true, replacement: true },

  { id: 'power_on_test', label: 'Power on and test the computer', group: 'Test' },
];

export const ACTIONS_BY_ID: Record<string, LabAction> = Object.fromEntries(
  ACTIONS.map((a) => [a.id, a]),
);

/** What an action shows when a scenario does not say anything special about it. */
export const DEFAULT_RESPONSES: Record<string, string> = {
  check_power_cable: 'The power cable is firmly connected and the wall socket works.',
  check_leds: 'The power light is on and the fans are spinning.',
  check_monitor: 'The monitor is on and its cable is firmly connected at both ends.',
  listen_beeps: 'No beeps heard.',
  read_screen: 'The screen works normally.',
  open_bios: 'BIOS/UEFI opens. The settings look normal.',
  check_temps: 'The CPU temperature is normal.',
  run_memtest: 'The memory test finishes with no errors.',
  run_disk_check: 'The drive health report is good.',
  check_startup: 'A normal number of startup programs and plenty of free disk space.',
  inspect_ram: 'The RAM modules are firmly seated and nothing looks damaged.',
  test_ram_modules: 'Each module works fine on its own.',
  inspect_psu_connections: 'All power connectors are firmly seated.',
  check_drive_cables: 'The drive data and power cables are firmly connected.',
  inspect_cooling: 'The fans spin freely and there is only a little dust.',
};

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Scenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  story: string;
  symptoms: string[];
  /** Text for each action that behaves in a special way in this scenario. */
  responses: Record<string, string>;
  /** Actions that repair the fault. */
  fixActions: string[];
  /** If set, software/BIOS actions are blocked with this message until fixed. */
  blockSoftwareUntilFixed?: string;
  /** Shown by "Power on and test" before the fault is fixed. */
  faultResult: string;
  /** Shown by "Power on and test" after the fault is fixed. */
  workingResult: string;
  diagnosisOptions: string[];
  /** Index of the correct item in diagnosisOptions. */
  correctOption: number;
  explanation: string;
  /** A good sequence of actions. Its length is the target number of steps. */
  idealPath: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'dead-pc',
    title: 'The computer is completely dead',
    difficulty: 'Easy',
    story:
      'A student reports that nothing happens when the power button is pressed. The computer worked yesterday, before the room was cleaned.',
    symptoms: ['No lights on the case', 'No fan noise', 'The monitor shows No signal'],
    blockSoftwareUntilFixed: 'The computer will not turn on, so this is not possible yet.',
    responses: {
      check_leds: 'No power light and no fan movement. The computer is getting no power at all.',
      check_power_cable:
        'The wall socket works (a lamp plugged into it lights up), but the cable at the back of the computer is not fully pushed into the power supply.',
      check_monitor: 'The monitor is on and shows No signal, which is normal when the computer is off.',
      listen_beeps: 'No beeps. The motherboard is not getting power, so it cannot beep.',
      read_screen: 'The screen shows No signal.',
      reseat_power_cable:
        'You pushed the power cable firmly into the socket on the power supply until it was fully inserted.',
    },
    fixActions: ['reseat_power_cable'],
    faultResult: 'Nothing happens. No lights and no fans.',
    workingResult: 'The computer powers on and starts normally. Fixed.',
    diagnosisOptions: [
      'Power cable not fully connected to the power supply',
      'Failed motherboard',
      'Faulty RAM',
      'Broken monitor',
    ],
    correctOption: 0,
    explanation:
      'With no lights and no fan movement, the first question is whether power reaches the computer at all. Checking the cable and the socket costs nothing and takes seconds. A loose cable is a very common cause after cleaning or moving equipment. Always check the simple, cheap things first.',
    idealPath: ['check_leds', 'check_power_cable', 'reseat_power_cable', 'power_on_test'],
  },
  {
    id: 'no-display-beeps',
    title: 'No picture on the screen, and the computer beeps',
    difficulty: 'Easy',
    story:
      'A computer powers on, but the screen shows No signal and the computer beeps repeatedly. It was moved to another room this morning.',
    symptoms: [
      'The power light is on',
      'The fans spin',
      'The screen shows No signal',
      'The computer repeats a beep pattern',
    ],
    blockSoftwareUntilFixed: 'There is no picture on the screen, so you cannot use BIOS or software yet.',
    responses: {
      check_monitor:
        'The monitor is on and the video cable is firmly connected at both ends. The monitor works with another computer.',
      listen_beeps:
        'The same beep pattern repeats. The motherboard manual says this pattern means memory not detected or not seated properly. (Beep codes differ between makers, so always check the manual.)',
      read_screen: 'No signal.',
      inspect_ram:
        'There are two RAM modules. One is fully clipped in. The other is slightly raised on one side and is not clicked into its slot.',
      reseat_ram:
        'You removed both modules and pushed them firmly into their slots until the clips clicked.',
    },
    fixActions: ['reseat_ram'],
    faultResult: 'Screen: No signal. The beeps repeat.',
    workingResult: 'The computer starts, the beeps stop, and the operating system loads. Fixed.',
    diagnosisOptions: [
      'RAM module not seated properly',
      'Broken monitor',
      'Failed hard drive',
      'Failed power supply',
    ],
    correctOption: 0,
    explanation:
      'The power supply works (light and fans), and the monitor works with another computer, so the fault is inside the computer. The manual says the beeps mean a memory problem. A RAM module that is not fully clipped in is common after moving a computer. Reseating it is free, so try it before replacing any part.',
    idealPath: [
      'check_monitor',
      'listen_beeps',
      'unplug',
      'open_case',
      'inspect_ram',
      'reseat_ram',
      'plug',
      'power_on_test',
    ],
  },
  {
    id: 'boot-device-not-found',
    title: 'The computer says "No bootable device"',
    difficulty: 'Medium',
    story:
      'A computer starts, then stops with a message about a missing boot device. A technician added a second fan to the case last week.',
    symptoms: [
      'The computer powers on and the fans spin',
      'A black screen with an error message',
      'The drive activity light never blinks',
    ],
    responses: {
      read_screen:
        'The screen shows: "No bootable device found. Insert boot disk and press any key."',
      check_leds: 'The power light is on. The drive activity light never blinks.',
      listen_beeps: 'One short beep. This motherboard manual says it means the self-test passed.',
      open_bios:
        'BIOS opens. The storage section lists no drives at all. The boot order setting looks normal.',
      change_boot_order:
        'The boot order is already correct. There is no drive to boot from, so changing it makes no difference.',
      check_temps: 'The CPU temperature is normal, about 40 C.',
      run_memtest: 'No operating system loads, so you cannot run this tool from here.',
      run_disk_check: 'No operating system loads, so you cannot run this tool from here.',
      check_startup: 'No operating system loads, so you cannot run this tool from here.',
      check_drive_cables:
        'The SATA data cable is loose at the motherboard end. The drive power cable is firmly connected.',
      reseat_drive_cables:
        'You pushed the SATA data cable firmly into the motherboard port until it clicked.',
      replace_drive:
        'You replaced the drive. The original drive was fine, so this was an unnecessary cost and you risked the data on it.',
    },
    fixActions: ['reseat_drive_cables'],
    faultResult: 'No bootable device. The drive is still not detected.',
    workingResult: 'BIOS now lists the drive and the operating system starts. Fixed.',
    diagnosisOptions: [
      'Loose drive data cable',
      'Wrong boot order in BIOS',
      'Faulty RAM',
      'The operating system needs reinstalling',
    ],
    correctOption: 0,
    explanation:
      'BIOS does not list any drive. If the drive were detected, a wrong boot order or a damaged operating system would be the next things to check. A missing drive points to its cable, its power, or the drive itself, and a cable is the cheapest to check. Opening the BIOS was the key step: it separated "drive not found" from "drive found but will not start".',
    idealPath: [
      'read_screen',
      'open_bios',
      'unplug',
      'open_case',
      'check_drive_cables',
      'reseat_drive_cables',
      'plug',
      'power_on_test',
    ],
  },
  {
    id: 'overheating-shutdown',
    title: 'The computer shuts down by itself',
    difficulty: 'Medium',
    story:
      'A computer works for 10 to 15 minutes and then switches off without warning, especially during heavy work. The fan is loud before it happens.',
    symptoms: [
      'Shuts down after 10 to 15 minutes of heavy use',
      'The fan is very loud before the shutdown',
      'The case feels hot',
      'It starts again after cooling down',
    ],
    responses: {
      check_leds: 'The power light is on. The fans spin fast and loud.',
      open_bios:
        'BIOS settings look normal. The hardware monitor page shows the CPU running very hot.',
      check_temps:
        'The CPU temperature is already about 75 C when idle and rises above 95 C under load. A normal idle temperature is much lower.',
      inspect_cooling:
        'The heatsink fins and the CPU fan are covered with thick dust. Air cannot flow through them.',
      clean_cooling:
        'You cleaned the dust from the fan and heatsink with a soft brush and compressed air, holding the fan still, and checked that the heatsink is fitted securely.',
      replace_psu:
        'You replaced the power supply. It was working fine, so the shutdowns continue and the money was wasted.',
    },
    fixActions: ['clean_cooling'],
    faultResult: 'The computer runs, gets very hot, and shuts down after a while.',
    workingResult:
      'The CPU stays cool when idle and well below the danger level under load. The shutdowns stop. Fixed.',
    diagnosisOptions: [
      'Dust blocking the CPU cooling',
      'Failing power supply',
      'Faulty RAM',
      'Failed hard drive',
    ],
    correctOption: 0,
    explanation:
      'Heat that climbs with load, loud fans, and a computer that restarts after cooling down all point to overheating. The temperature reading gave the evidence and the inspection showed the cause. A failing power supply or faulty RAM would not show a CPU temperature that rises so far.',
    idealPath: [
      'check_temps',
      'unplug',
      'open_case',
      'inspect_cooling',
      'clean_cooling',
      'plug',
      'power_on_test',
    ],
  },
  {
    id: 'random-crashes',
    title: 'Random freezes and blue screens',
    difficulty: 'Hard',
    story:
      'A computer freezes or shows a blue screen several times a day, sometimes at startup and sometimes after hours. It started a few weeks ago.',
    symptoms: [
      'Freezes or blue screens at random times',
      'It always restarts and works again for a while',
      'No sign of overheating',
    ],
    responses: {
      listen_beeps: 'One short beep. The self-test passes.',
      check_temps: 'The CPU temperature is normal: about 40 C idle and 65 C under load.',
      open_bios: 'BIOS shows 16 GB of memory installed. The settings look normal.',
      run_memtest:
        'The memory test reports errors on repeated passes. Errors suggest a faulty memory module, but the test cannot say which one.',
      run_disk_check: 'The drive health report is good, with no bad sectors.',
      check_startup: 'A normal number of startup programs and plenty of free disk space.',
      inspect_ram:
        'There are two 8 GB modules. Both are firmly seated and nothing looks damaged. (A visual check cannot find an electrical fault.)',
      reseat_ram: 'You reseated both modules. The crashes continue: the modules were not loose.',
      test_ram_modules:
        'You tested each module alone under heavy use. The module in slot 1 is stable. The module in slot 2 causes the crashes.',
      replace_ram:
        'You replaced the faulty module in slot 2 with a known-good module of the same type.',
    },
    fixActions: ['replace_ram'],
    faultResult: 'The computer works for now, but it crashes again later.',
    workingResult: 'No crashes during a long stress test. Fixed.',
    diagnosisOptions: [
      'Faulty RAM module',
      'Overheating CPU',
      'Damaged operating system',
      'Failing hard drive',
    ],
    correctOption: 0,
    explanation:
      'Random crashes with normal temperatures and a healthy drive point to memory. The memory test showed errors, and testing one module at a time found the bad one. Reseating does not help when the module itself is faulty, and replacing both modules would have cost more than needed.',
    idealPath: [
      'run_memtest',
      'unplug',
      'open_case',
      'test_ram_modules',
      'replace_ram',
      'plug',
      'power_on_test',
    ],
  },
  {
    id: 'slow-system',
    title: 'The computer is very slow',
    difficulty: 'Hard',
    story:
      'A computer takes several minutes to start and programs open slowly. The user says it has become slower over many months. Nothing is broken, but it is hard to use.',
    symptoms: [
      'Slow to start, several minutes',
      'Programs open slowly',
      'No error messages',
      'The fans are quiet',
    ],
    responses: {
      open_bios: 'BIOS settings look normal.',
      check_temps: 'The CPU temperature is normal.',
      run_memtest: 'The memory test passes with no errors.',
      run_disk_check: 'The drive health report is good, but the drive is 97% full.',
      check_startup:
        'More than 40 programs start with the operating system, and the drive is 97% full.',
      clean_startup:
        'You disabled the unneeded startup programs and removed unused files, which freed a large amount of space.',
      replace_drive:
        'You replaced the drive. The original was healthy, so this was an unnecessary cost.',
    },
    fixActions: ['clean_startup'],
    faultResult: 'The computer is still very slow.',
    workingResult: 'The computer starts much faster and programs open quickly. Fixed.',
    diagnosisOptions: [
      'Too many startup programs and an almost full drive',
      'Failing RAM',
      'Overheating CPU',
      'Failing power supply',
    ],
    correctOption: 0,
    explanation:
      'The hardware tests all pass, so the cause is software and storage: many startup programs and an almost full drive. The cheapest fix is a clean-up, not buying parts. Slow computers are often a software problem, so test before you replace anything.',
    idealPath: ['check_temps', 'run_disk_check', 'check_startup', 'clean_startup', 'power_on_test'],
  },
];
