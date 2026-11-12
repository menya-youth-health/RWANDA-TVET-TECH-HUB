// Networking course for the prototype.
//
// IMPORTANT: SAMPLE / PLACEHOLDER content. It does not follow the official RTB
// module list. Have a qualified teacher check every lesson and quiz question.

import type { Module, Question } from './course';

export const NET_MODULES: Module[] = [
  {
    id: 'net-m1',
    title: 'Network fundamentals',
    placeholder: true,
    lessons: [
      {
        id: 'what-is-a-network',
        title: 'What is a network?',
        minutes: 8,
        objectives: [
          'Explain what a network is and why we build one',
          'Tell a LAN from a WAN',
          'Explain the roles of client and server',
        ],
        blocks: [
          {
            type: 'p',
            text: 'A network connects devices so they can share data and resources such as files, printers and an internet connection. A school computer lab is a network. So is the internet, which connects millions of networks together.',
          },
          {
            type: 'ul',
            items: [
              'LAN (local area network): covers a small area, such as one room, one building or one school.',
              'WAN (wide area network): covers a large area. The internet is the biggest WAN.',
            ],
          },
          {
            type: 'p',
            text: 'In many networks a client asks for something and a server provides it. Your browser is a client. A web server stores the website and sends it when asked.',
          },
          { type: 'h', text: 'What a network is made of' },
          {
            type: 'ul',
            items: [
              'End devices: computers, phones and printers.',
              'Network devices: switches, routers and wireless access points.',
              'Links: cables or wireless signals.',
            ],
          },
        ],
      },
      {
        id: 'ip-addresses',
        title: 'IP addresses and subnet masks',
        minutes: 12,
        objectives: [
          'Read an IPv4 address',
          'Say which devices are on the same network',
          'Name the private address ranges',
        ],
        blocks: [
          {
            type: 'p',
            text: 'An IP address identifies a device on a network. An IPv4 address has four numbers from 0 to 255, separated by dots, for example 192.168.1.10.',
          },
          {
            type: 'p',
            text: 'The subnet mask shows which part of the address names the network and which part names the device. With the mask 255.255.255.0 (also written /24), the first three numbers are the network and the last number is the device. That gives 254 usable device addresses on one network, from .1 to .254.',
          },
          {
            type: 'ul',
            items: [
              '192.168.1.10 and 192.168.1.20 are on the same network (192.168.1.x).',
              '192.168.2.20 is on a different network (192.168.2.x).',
            ],
          },
          { type: 'h', text: 'Private address ranges' },
          {
            type: 'p',
            text: 'Addresses in these ranges are used inside local networks and are not used on the public internet:',
          },
          {
            type: 'ul',
            items: ['10.0.0.0 to 10.255.255.255', '172.16.0.0 to 172.31.255.255', '192.168.0.0 to 192.168.255.255'],
          },
          {
            type: 'p',
            text: 'The default gateway is the address of the router. A device sends traffic to the gateway when the destination is on another network.',
          },
        ],
      },
      {
        id: 'network-devices',
        title: 'Switches, routers and access points',
        minutes: 10,
        objectives: [
          'Say what a switch, a router and an access point do',
          'Choose the right device for a job',
        ],
        blocks: [
          {
            type: 'ul',
            items: [
              'Switch: connects devices inside one local network. It learns which device is on which port and sends data only to the device it is meant for.',
              'Router: connects different networks, for example your school LAN to the internet. It uses IP addresses to choose where to send data.',
              'Wireless access point: lets Wi-Fi devices join the network.',
              'Modem: connects the network to the internet service provider. Many small routers include a modem and an access point in one box.',
            ],
          },
          {
            type: 'p',
            text: 'A simple rule: to connect devices that are on the same network, use a switch. To connect two networks, use a router.',
          },
        ],
      },
    ],
  },
  {
    id: 'net-m2',
    title: 'Working on networks',
    placeholder: true,
    lessons: [
      {
        id: 'cabling',
        title: 'Cabling and testing',
        minutes: 10,
        objectives: [
          'Name the common network cables',
          'Give the maximum length of a copper Ethernet segment',
          'Describe the T568B colour order',
        ],
        blocks: [
          {
            type: 'p',
            text: 'Most wired networks use unshielded twisted pair (UTP) cable, such as Cat5e or Cat6, with an RJ45 connector on each end. A copper Ethernet segment can be at most 100 metres long. Fibre optic cable carries light instead of electricity, reaches much longer distances and is not affected by electrical interference.',
          },
          { type: 'h', text: 'T568B colour order' },
          {
            type: 'ol',
            items: [
              'White and orange',
              'Orange',
              'White and green',
              'Blue',
              'White and blue',
              'Green',
              'White and brown',
              'Brown',
            ],
          },
          {
            type: 'p',
            text: 'A straight-through cable has the same order at both ends and connects different kinds of device, such as a computer to a switch. Most modern devices detect the cable type automatically, so a special crossover cable is rarely needed. After making a cable, check it with a cable tester.',
          },
          {
            type: 'ul',
            items: [
              'Do not bend cables sharply or pull them tight.',
              'Keep data cables away from mains power cables.',
              'Label both ends so the cable can be found later.',
            ],
          },
        ],
      },
      {
        id: 'dns-dhcp-ping',
        title: 'DHCP, DNS and troubleshooting with ping',
        minutes: 12,
        objectives: [
          'Explain what DHCP and DNS do',
          'Use ping to test a connection step by step',
          'Recognise an address that starts with 169.254',
        ],
        blocks: [
          {
            type: 'ul',
            items: [
              'DHCP gives devices an IP address, subnet mask, gateway and DNS server automatically when they join the network.',
              'DNS turns a name, such as a website address, into the IP address a computer needs.',
            ],
          },
          {
            type: 'p',
            text: 'Ping sends a small test message to another device and waits for a reply. Use ipconfig on Windows or ip addr on Linux to see your own address.',
          },
          { type: 'h', text: 'A simple way to find the problem' },
          {
            type: 'ol',
            items: [
              'Check the cable or the Wi-Fi connection and the lights on the device.',
              'Look at your own IP address.',
              'Ping the default gateway. If it fails, the problem is on your local network.',
              'Ping a public address such as 8.8.8.8. If it fails, the problem is beyond your router.',
              'Ping a website name. If the address worked but the name fails, the problem is DNS.',
            ],
          },
          {
            type: 'p',
            text: 'If a device has an address starting with 169.254, it could not get an address from DHCP. Check the cable, the switch and the DHCP service.',
          },
          { type: 'code', text: 'ping 192.168.1.1\nping 8.8.8.8' },
        ],
      },
      {
        id: 'network-security-basics',
        title: 'Network security basics',
        minutes: 10,
        objectives: [
          'Name common threats to a network',
          'List simple defences',
          'Explain why you must have permission before testing a network',
        ],
        blocks: [
          {
            type: 'p',
            text: 'Common threats include weak or reused passwords, phishing (fake messages that trick people), malware and unprotected Wi-Fi.',
          },
          { type: 'h', text: 'Simple defences' },
          {
            type: 'ul',
            items: [
              'Use strong passwords that are different for every account.',
              'Change the default password on routers and other devices.',
              'Use WPA2 or WPA3 on Wi-Fi. Do not leave Wi-Fi open, and do not use the old WEP method.',
              'Install updates for devices and software.',
              'Use a firewall and keep backups.',
              'Think before you click a link or open an attachment.',
            ],
          },
          {
            type: 'p',
            text: 'Only test or scan networks that you own or have written permission to use. Trying to enter other people\'s systems is illegal and harmful.',
          },
        ],
      },
    ],
  },
];

export const NET_QUIZ: Question[] = [
  {
    id: 'n1',
    prompt: 'Which kind of network covers a small area such as a school computer lab?',
    options: ['LAN', 'WAN', 'The internet', 'A server'],
    correct: 0,
    explanation: 'A LAN (local area network) covers a small area. A WAN covers a wide area.',
  },
  {
    id: 'n2',
    prompt: 'Which of these is a valid IPv4 address?',
    options: ['192.168.1.10', '192.168.1.300', '192.168.1', '192.168.1.10.5'],
    correct: 0,
    explanation: 'An IPv4 address has four numbers from 0 to 255. 300 is too large.',
  },
  {
    id: 'n3',
    prompt: 'With the subnet mask 255.255.255.0, which device is on the same network as 192.168.1.10?',
    options: ['192.168.1.50', '192.168.2.10', '10.0.0.10', '172.16.1.10'],
    correct: 0,
    explanation: 'With a /24 mask the first three numbers must match: 192.168.1.',
  },
  {
    id: 'n4',
    prompt: 'Which device connects different networks, such as a school LAN and the internet?',
    options: ['Router', 'Switch', 'Network cable', 'Wireless access point'],
    correct: 0,
    explanation: 'A router connects networks. A switch connects devices inside one network.',
  },
  {
    id: 'n5',
    prompt: 'What is the maximum length of one copper Ethernet cable segment?',
    options: ['100 metres', '10 metres', '500 metres', '1 kilometre'],
    correct: 0,
    explanation: 'Copper Ethernet segments should be no longer than 100 metres.',
  },
  {
    id: 'n6',
    prompt: 'What does DHCP do?',
    options: [
      'Gives devices their IP address settings automatically',
      'Turns website names into IP addresses',
      'Encrypts all network traffic',
      'Connects two cables together',
    ],
    correct: 0,
    explanation: 'DHCP hands out IP addresses and related settings. Turning names into addresses is DNS.',
  },
  {
    id: 'n7',
    prompt: 'A computer shows the address 169.254.12.5 and cannot reach the network. What is the most likely reason?',
    options: [
      'It could not get an address from DHCP',
      'The monitor is faulty',
      'The website is down',
      'The keyboard is not connected',
    ],
    correct: 0,
    explanation: 'Addresses starting with 169.254 appear when a device gets no answer from DHCP.',
  },
  {
    id: 'n8',
    prompt: 'Ping to 8.8.8.8 works, but ping to a website name fails. Which service is most likely at fault?',
    options: ['DNS', 'DHCP', 'The network cable', 'The switch power'],
    correct: 0,
    explanation: 'The connection works, but names are not being turned into addresses, which is the job of DNS.',
  },
  {
    id: 'n9',
    prompt: 'Which Wi-Fi security setting is the best choice?',
    options: ['WPA2 or WPA3', 'WEP', 'An open network with no password', 'Hiding the network name only'],
    correct: 0,
    explanation: 'WPA2 and WPA3 are current protections. WEP is outdated and open networks give no protection.',
  },
];
