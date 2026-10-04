import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Calculator, 
  AlertTriangle, 
  Award, 
  Clock, 
  FileText, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Printer,
  Cpu,
  Layers,
  Table2,
  Zap,
  Binary
} from 'lucide-react';
import { ExamProgressTracker, TopicProgressSummary } from './ExamProgressTracker';

interface IBSubQuestion {
  subId: string;
  marks: number;
  question: string;
  commandTerm: string;
  commandTermDef: string;
  markScheme: string[];
  easyExplanation: string;
  examinerTip: string;
  textbookRef: string;
  sampleAnswer: string;
}

interface IBExamQuestion {
  id: number;
  syllabusCode: 'A1.2.1' | 'A1.2.2' | 'A1.2.3' | 'A1.2.4' | 'A1.2.5';
  syllabusLabel: string;
  topicTitle: string;
  totalMarks: number;
  contextScenario?: string;
  subQuestions: IBSubQuestion[];
}

export const IBExamPractice: React.FC = () => {
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  
  // Initialize from localStorage for persistence across reloads/tabs
  const [studentNotes, setStudentNotes] = useState<{ [key: string]: string }>(() => {
    try {
      const saved = localStorage.getItem('ib_exam_notes_all') || localStorage.getItem('ib_exam_notes_a122');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [studentScores, setStudentScores] = useState<{ [key: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('ib_exam_scores_all') || localStorage.getItem('ib_exam_scores_a122');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'answered'>('all');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ib_exam_notes_all', JSON.stringify(studentNotes));
    } catch {}
  }, [studentNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('ib_exam_scores_all', JSON.stringify(studentScores));
    } catch {}
  }, [studentScores]);

  const questions: IBExamQuestion[] = [
    {
      id: 1,
      syllabusCode: 'A1.2.2',
      syllabusLabel: 'How Binary Stores Data',
      topicTitle: 'Characters & Strings (ASCII & Unicode Standards)',
      totalMarks: 6,
      contextScenario: 'A messaging application transmits text across different computing platforms and operates with both legacy systems and modern multilingual international users.',
      subQuestions: [
        {
          subId: '1a',
          marks: 2,
          commandTerm: 'Outline',
          commandTermDef: 'Give a brief summary of the essential features.',
          question: 'Outline two reasons why the ASCII encoding standard was developed in the early 1960s.',
          textbookRef: 'Hodder p. 31 (PDF p. 41)',
          markScheme: [
            'Award [1] for noting the lack of standardized text encoding between early hardware manufacturers.',
            'Award [1] for explaining that proprietary systems caused severe communication and compatibility problems when transferring data between different machines.'
          ],
          easyExplanation: 'Before ASCII, every computer company (IBM, Xerox, etc.) had its own secret code for letters. If Computer A sent the letter "H" to Computer B, it showed up as garbage or crashed. ASCII was created in 1963 as a universal "Rosetta Stone" so any machine could read the same 7-bit numbers as the same letters.',
          examinerTip: 'Do not just say "to make letters binary". Focus on interoperability, compatibility, and standardizing interchange across different manufacturers.',
          sampleAnswer: '1. Prior to ASCII, each computer manufacturer used proprietary encoding schemes, which made data exchange between systems virtually impossible.\n2. ASCII established an open, universal standard (initially 7-bit, 128 characters) allowing different computers to consistently interpret characters, numbers, and control codes.'
        },
        {
          subId: '1b',
          marks: 2,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain how uppercase and lowercase Latin characters are distinguished and converted in the binary structure of ASCII.',
          textbookRef: 'Hodder p. 31–32 (PDF p. 41–42)',
          markScheme: [
            'Award [1] for identifying that the first 3 bits from the left determine the casing (010 for uppercase, 011 for lowercase).',
            'Award [1] for explaining that the remaining 5 bits denote the alphabetical position (1–26), meaning toggling bit 5 (value 32) switches between uppercase and lowercase.'
          ],
          easyExplanation: 'ASCII was designed brilliantly: all capital letters start with binary 010 (e.g. A = 010 00001 = 65), and all lowercase letters start with binary 011 (e.g. a = 011 00001 = 97). The last 5 bits are simply the letter number in the alphabet (00001 is 1). The difference between "A" and "a" is exactly 32 (bit 5). To change case, hardware just flips bit 5!',
          examinerTip: 'Refer to both the first 3 bits (casing prefix) and the last 5 bits (alphabet position). Stating "they differ by 32" is acceptable if supported by the bit-level explanation.',
          sampleAnswer: 'In standard ASCII, the first three bits from the left indicate casing: 010 represents uppercase (e.g. "A" is 01000001₂) and 011 represents lowercase (e.g. "a" is 01100001₂). The last five bits represent the 1-indexed alphabetical position (00001 = 1st letter). Therefore, toggling bit 5 (value 32) converts uppercase directly to lowercase without arithmetic lookups.'
        },
        {
          subId: '1c',
          marks: 2,
          commandTerm: 'Describe',
          commandTermDef: 'Give a detailed account or picture of a situation, event, pattern or process.',
          question: 'Describe why the Unicode Consortium implemented UTF-8 as a variable-length encoding (1 to 4 bytes) instead of standardizing all characters to a fixed 32 bits (UTF-32).',
          textbookRef: 'Hodder p. 32–34 (PDF p. 42–44)',
          markScheme: [
            'Award [1] for identifying storage/bandwidth efficiency and backward compatibility with ASCII (1 byte for Latin text instead of 4 bytes).',
            'Award [1] for noting that fixed 32-bit (UTF-32) would quadruple the size of existing web pages and introduce streams of consecutive zeros (00000000) that older networking systems misinterpret as end-of-transmission.'
          ],
          easyExplanation: 'If every character took 4 bytes (32 bits), every English web page and file would become 400% larger overnight! Also, ASCII letters like "A" would have three bytes of pure zeros (00000000), which old internet routers thought meant "stop transmission". UTF-8 uses 1 byte for regular English, and only expands to 2, 3, or 4 bytes when you need special accents, Chinese characters, or emojis.',
          examinerTip: 'Mention both storage efficiency (avoiding quadrupling document size) and preserving 100% backward compatibility with ASCII.',
          sampleAnswer: 'If all characters were fixed at 32 bits, every ASCII text file and website would quadruple in storage and bandwidth. Additionally, older systems would receive sequences of eight zeros (00000000), which were historically parsed as end-of-communication signals. UTF-8 solves this by using a variable length of 1 to 4 bytes: standard ASCII characters take only 1 byte (100% backward compatible), while international characters and emojis expand dynamically.'
        }
      ]
    },
    {
      id: 2,
      syllabusCode: 'A1.2.2',
      syllabusLabel: 'How Binary Stores Data',
      topicTitle: 'Bitmap Images, Pixel Resolution & Metadata Calculations',
      totalMarks: 8,
      contextScenario: 'A medical laboratory operates a digital imaging scanner that captures high-precision histological tissue samples.',
      subQuestions: [
        {
          subId: '2a',
          marks: 2,
          commandTerm: 'Define & State',
          commandTermDef: 'Give the precise meaning and express the effect.',
          question: 'Define the term "colour depth" and state how increasing colour depth affects both visual representation and file storage.',
          textbookRef: 'Hodder p. 37–38 (PDF p. 47–48)',
          markScheme: [
            'Award [1] for defining colour depth (or bit depth) as the number of bits allocated to represent the colour of each individual pixel (determining 2^n possible colours).',
            'Award [1] for stating that increasing colour depth produces smoother gradients without colour banding, but directly increases overall file size and memory requirements.'
          ],
          easyExplanation: 'Colour depth is how many binary bits are spent on each pixel dot. 1-bit only gives 2 colours (black or white). 8-bit gives 256 colours. 24-bit gives 16.8 million colours. More bits mean stunning photorealistic colours without "banding" (ugly stripe steps in skies or skin tones), but the file takes up far more storage space.',
          examinerTip: 'Always mention the formula 2^n colours when defining bit depth, and state both the benefit (smooth colors, no banding) and trade-off (larger file size).',
          sampleAnswer: 'Colour depth (bit depth) refers to the number of binary bits used to encode the colour of each individual pixel in a bitmap graphic, giving 2ⁿ unique possible colours. Increasing colour depth allows a wider gamut and smoother gradients (preventing colour banding), but proportionally increases the file size and network transmission times.'
        },
        {
          subId: '2b',
          marks: 2,
          commandTerm: 'Outline',
          commandTermDef: 'Give a brief summary of essential features.',
          question: 'Outline the purpose of metadata in a digital bitmap image file, giving two examples of information typically stored.',
          textbookRef: 'Hodder p. 37, 40 (PDF p. 47, 50)',
          markScheme: [
            'Award [1] for defining metadata as descriptive header data that informs the operating system / CPU how to accurately decode, interpret, and render the raw pixel byte stream.',
            'Award [1] for providing two valid examples (e.g., image dimensions/resolution [width × height], colour depth, compression format, date/time created, camera EXIF settings).'
          ],
          easyExplanation: 'A bitmap file is just a giant list of 1s and 0s. The computer has no idea whether it is 800 pixels wide or 100 pixels wide unless there is a header at the start telling it: "Width: 800, Height: 600, Bit Depth: 24". That instruction header is called METADATA.',
          examinerTip: 'Do not confuse metadata with pixel data. Metadata describes the structure and properties of the file, not the image content itself.',
          sampleAnswer: 'Metadata is header information stored alongside the raw image data that provides context and structural attributes enabling software and hardware to correctly display and manage the file. Two examples include: 1) Image resolution dimensions (width and height in pixels), and 2) Colour depth (bits per pixel).'
        },
        {
          subId: '2c',
          marks: 4,
          commandTerm: 'Calculate',
          commandTermDef: 'Obtain a numerical result showing the relevant stages in the working.',
          question: 'Determine the storage capacity needed for an uncompressed bitmap image with dimensions of 800 × 600 pixels that supports 512 different colours. Calculate the total file size in kilobytes (kB) if file metadata occupies an additional 25 per cent of the space. Present your answer with full working.',
          textbookRef: 'Hodder p. 40 Review Question 4 (PDF p. 50)',
          markScheme: [
            'Award [1] for identifying colour depth: 512 colours = 2⁹, therefore colour depth = 9 bits per pixel.',
            'Award [1] for calculating raw pixel bits: 800 × 600 = 480,000 pixels; 480,000 × 9 = 4,320,000 bits.',
            'Award [1] for converting bits to bytes: 4,320,000 ÷ 8 = 540,000 bytes.',
            'Award [1] for adding 25% metadata: 540,000 × 1.25 = 675,000 bytes = 675 kB (or 659.18 KiB if using 1024).'
          ],
          easyExplanation: 'Step 1: 512 colors needs 9 bits (because 2⁸ = 256 is too small, 2⁹ = 512).\nStep 2: Total pixels = 800 × 600 = 480,000.\nStep 3: Total bits = 480,000 × 9 = 4,320,000 bits.\nStep 4: Convert to bytes (divide by 8) = 540,000 bytes.\nStep 5: Add 25% metadata = 540,000 × 1.25 = 675,000 bytes.\nStep 6: In kB (divide by 1000) = 675 kB!',
          examinerTip: 'Watch out: Students commonly forget to divide by 8 to convert bits to bytes, or fail to deduce that 512 colours requires 9 bits.',
          sampleAnswer: '1. Colour Depth: 2ⁿ = 512 ⇒ n = 9 bits per pixel.\n2. Total Pixels: 800 × 600 = 480,000 pixels.\n3. Raw Data in Bits: 480,000 × 9 bits = 4,320,000 bits.\n4. Raw Data in Bytes: 4,320,000 ÷ 8 = 540,000 bytes.\n5. Adding 25% Metadata: 540,000 × 1.25 = 675,000 bytes.\n6. Total Size in Kilobytes: 675,000 ÷ 1000 = 675 kB (or 675,000 ÷ 1024 = 659.18 KiB).'
        }
      ]
    },
    {
      id: 3,
      syllabusCode: 'A1.2.2',
      syllabusLabel: 'How Binary Stores Data',
      topicTitle: 'Digital Audio & Analogue-to-Digital Conversion (ADC)',
      totalMarks: 7,
      contextScenario: 'A recording studio digitizes acoustic performances using professional microphone preamplifiers and audio interfaces.',
      subQuestions: [
        {
          subId: '3a',
          marks: 2,
          commandTerm: 'Distinguish',
          commandTermDef: 'Make clear the differences between two or more concepts or items.',
          question: 'Distinguish between an analogue sound signal and a digital audio representation.',
          textbookRef: 'Hodder p. 44 (PDF p. 54)',
          markScheme: [
            'Award [1] for stating that analogue sound is a continuous waveform representing physical fluctuations in air pressure.',
            'Award [1] for stating that digital audio represents sound as a sequence of discrete numerical binary values (0s and 1s) sampled at specific points in time.'
          ],
          easyExplanation: 'Analogue is smooth and continuous like a slide—every infinite value between 0 and 1 exists. Digital is like stairs: a computer takes rapid snapshots (samples) and rounds each measurement to discrete binary numbers.',
          examinerTip: 'Use the key technical terms "continuous" for analogue and "discrete" or "sampled" for digital.',
          sampleAnswer: 'An analogue sound signal is a continuous wave representing smooth physical variations in air pressure over time. In contrast, digital audio consists of discrete numerical values in binary format, created by periodically measuring and quantizing the amplitude of the analogue wave at finite time intervals.'
        },
        {
          subId: '3b',
          marks: 2,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain the distinct functions of sampling rate and bit depth during the Analogue-to-Digital Conversion (ADC) process.',
          textbookRef: 'Hodder p. 44 (PDF p. 54)',
          markScheme: [
            'Award [1] for explaining that sampling rate (measured in Hz/kHz) is the frequency at which amplitude measurements are recorded per second (determines frequency range / temporal accuracy).',
            'Award [1] for explaining that bit depth determines the number of bits used to record the amplitude level of each sample, dictating the dynamic range and quantization precision.'
          ],
          easyExplanation: 'Think of audio like a movie: Sampling Rate is how many pictures you snap per second (e.g. 44,100 times a second). Bit Depth is how many steps on your measuring tape you have to measure loudness (16-bit = 65,536 levels; 24-bit = 16.7 million levels).',
          examinerTip: 'Do not mix up the units: sampling rate is measured in Hertz (Hz/kHz) on the horizontal time axis; bit depth is measured in bits per sample on the vertical amplitude axis.',
          sampleAnswer: '1. Sampling Rate: Measures how frequently the ADC takes snapshots of the audio amplitude per second (measured in Hz). A higher rate accurately reconstructs higher sound frequencies and avoids aliasing.\n2. Bit Depth: Specifies the number of bits allocated to each sample to encode its amplitude level (e.g. 16-bit provides 2¹⁶ = 65,536 amplitude steps). A higher bit depth increases dynamic range and reduces quantization noise.'
        },
        {
          subId: '3c',
          marks: 3,
          commandTerm: 'Calculate',
          commandTermDef: 'Obtain a numerical result showing the relevant stages in the working.',
          question: 'Calculate the total storage needed for a 44.1 kHz, 16-bit stereo audio file with a duration of 1 minute. Show all your working and express your answer in megabytes (MB).',
          textbookRef: 'Hodder p. 44–45 (PDF p. 54–55)',
          markScheme: [
            'Award [1] for setting up the equation: 44,100 samples/s × 16 bits × 2 channels × 60 s = 84,672,000 bits.',
            'Award [1] for converting to bytes: 84,672,000 ÷ 8 = 10,584,000 bytes (or 176,400 bytes/s × 60).',
            'Award [1] for final conversion to MB: 10,584,000 ÷ 1,000,000 = 10.584 MB (or 10,584,000 ÷ 1,048,576 = 10.09 MiB).'
          ],
          easyExplanation: 'Formula: Rate × Bit Depth × Channels × Seconds ÷ 8.\n1. Samples: 44,100 per sec.\n2. Bits per sample: 16.\n3. Channels: 2 (Stereo means TWO channels! Don\'t forget to multiply by 2!).\n4. Seconds: 60.\nMath: 44,100 × 16 × 2 × 60 = 84,672,000 bits.\nDivide by 8 = 10,584,000 bytes = 10.58 MB.',
          examinerTip: 'The most frequent student mistake is omitting the channel multiplier for stereo (×2). Always check if the audio is mono (×1) or stereo (×2)!',
          sampleAnswer: '1. Samples per second = 44,100 Hz\n2. Bits per sample = 16 bits\n3. Channels = 2 (stereo)\n4. Duration = 60 seconds\n\nTotal Bits = 44,100 × 16 × 2 × 60 = 84,672,000 bits\nTotal Bytes = 84,672,000 ÷ 8 = 10,584,000 bytes\nTotal Storage = 10,584,000 ÷ 1,000,000 = 10.584 MB (or 10.09 MiB in base-2).'
        }
      ]
    },
    {
      id: 4,
      syllabusCode: 'A1.2.2',
      syllabusLabel: 'How Binary Stores Data',
      topicTitle: 'Digital Video & Compression Techniques',
      totalMarks: 7,
      contextScenario: 'A cloud streaming platform encodes video on-demand for millions of simultaneous viewers worldwide.',
      subQuestions: [
        {
          subId: '4a',
          marks: 2,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain how still frames create the illusion of smooth motion in digital video playback, referencing the flipbook concept.',
          textbookRef: 'Hodder p. 46 (PDF p. 56)',
          markScheme: [
            'Award [1] for explaining that video is composed of a continuous sequence of still bitmap images (frames) captured and displayed at rapid rates (typically 24 to 60 fps).',
            'Award [1] for explaining that the human visual system relies on persistence of vision to blend sequential images into the perception of fluid continuous motion (analogous to a flipbook).'
          ],
          easyExplanation: 'A video does not actually move! It is just a stack of still photos displayed one after another at 24 to 60 frames per second. Because the human brain holds onto an image for a split second (persistence of vision), your brain connects the frames smoothly into motion, exactly like flipping the pages of a cartoon flipbook.',
          examinerTip: 'Explicitly reference the frame rate (24–60 fps) and persistence of vision / brain blending still frames.',
          sampleAnswer: 'Digital video is fundamentally stored as a sequence of still bitmap pictures called frames. When these frames are presented in rapid chronological succession (typically 24 to 60 frames per second), the human brain relies on persistence of vision to merge the discrete still images into the illusion of continuous fluid motion, directly mirroring the mechanical operation of a flipbook.'
        },
        {
          subId: '4b',
          marks: 2,
          commandTerm: 'Distinguish',
          commandTermDef: 'Make clear the differences between two or more concepts or items.',
          question: 'Distinguish between spatial compression (intraframe) and temporal compression (interframe) in video storage.',
          textbookRef: 'Hodder p. 46–47 (PDF p. 56–57)',
          markScheme: [
            'Award [1] for spatial compression: removes redundant information within a single isolated frame (e.g. compressing uniform color areas or textures using DCT).',
            'Award [1] for temporal compression: eliminates redundant data across consecutive frames by predicting motion and only storing the differences (deltas) and motion vectors.'
          ],
          easyExplanation: 'Spatial = Inside 1 single frame (e.g., instead of saving 1 million blue pixels for the sky in frame 1, compress them using JPEG). Temporal = Between multiple frames over time (if a news anchor is talking, their suit and the studio background don\'t move—so temporal compression only stores the moving lips, throwing away 95% of unchanged background pixels!).',
          examinerTip: 'Spatial = intraframe (within frame); Temporal = interframe (between consecutive frames over time).',
          sampleAnswer: '1. Spatial Compression (Intraframe): Operates within an individual frame by eliminating redundant pixel data and textures across neighboring pixels in that single image (similar to JPEG compression).\n2. Temporal Compression (Interframe): Operates across time between consecutive frames. It takes advantage of the fact that background scenery remains stationary, transmitting only the changes (deltas) and motion vectors from one frame to the next.'
        },
        {
          subId: '4c',
          marks: 3,
          commandTerm: 'Calculate & Evaluate',
          commandTermDef: 'Obtain numerical result and weigh up significance.',
          question: 'Calculate the total storage needed for a 10-minute uncompressed video with a frame rate of 30 frames per second, 24-bit colour depth, and a resolution of 1920 × 1080 pixels. Evaluate why compression is indispensable.',
          textbookRef: 'Hodder p. 47 Review Question 4 (PDF p. 57)',
          markScheme: [
            'Award [1] for calculating total frames: 10 min × 60 s = 600 s; 600 × 30 fps = 18,000 frames.',
            'Award [1] for calculating bytes per frame and total: 1920 × 1080 × 3 bytes = 6,220,800 bytes per frame; 18,000 × 6,220,800 = 111,974,400,000 bytes (~111.97 GB).',
            'Award [1] for evaluation: Uncompressed video would exhaust consumer storage devices within hours and completely saturate network bandwidth, making streaming impossible without compression.'
          ],
          easyExplanation: '10 minutes = 600 seconds.\nAt 30 frames a second = 18,000 frames.\nEach frame is 1920 × 1080 × 24 bits = 49.7 million bits = 6.22 MB per photo!\n18,000 frames × 6.22 MB = ~112 GIGABYTES for just 10 minutes of video!\nWithout video compression, your entire phone storage would fill up in 15 minutes of recording.',
          examinerTip: 'Break the calculation down step-by-step: duration in seconds → total frames → bytes per frame → total gigabytes.',
          sampleAnswer: '1. Duration in seconds = 10 × 60 = 600 seconds.\n2. Total frames = 600 s × 30 fps = 18,000 frames.\n3. Data per frame = 1920 × 1080 × 24 bits = 49,766,400 bits = 6,220,800 bytes (~6.22 MB).\n4. Total uncompressed storage = 18,000 × 6,220,800 bytes = 111,974,400,000 bytes ≈ 111.97 GB.\n\nEvaluation: At ~112 GB for just 10 minutes of video, uncompressed video transmission is completely unfeasible for standard hard drives, internet streaming, or mobile networks. Both spatial and temporal compression are mandatory to reduce file sizes by over 95% without perceptible loss of quality.'
        }
      ]
    },
    {
      id: 5,
      syllabusCode: 'A1.2.2',
      syllabusLabel: 'How Binary Stores Data',
      topicTitle: 'Binary Integer Encodings (Two\'s Complement & Gray Code)',
      totalMarks: 8,
      contextScenario: 'An embedded robotics control unit reads sensory angular positions and performs signed arithmetic in the CPU ALU.',
      subQuestions: [
        {
          subId: '5a',
          marks: 3,
          commandTerm: 'Convert',
          commandTermDef: 'Change into another form.',
          question: 'Convert the decimal number -5 into an 8-bit Two\'s Complement binary number. Show each intermediate step clearly.',
          textbookRef: 'Hodder p. 47 (PDF p. 57)',
          markScheme: [
            'Award [1] for stating the positive equivalent in 8 bits: +5 = 00000101₂.',
            'Award [1] for inverting all the bits (bitwise NOT / 1\'s complement): 11111010₂.',
            'Award [1] for adding 1 to the least significant bit (LSB) to obtain: 11111011₂.'
          ],
          easyExplanation: 'Step 1: Write positive 5 in 8 bits: 00000101.\nStep 2: Flip every bit (0 becomes 1, 1 becomes 0): 11111010.\nStep 3: Add 1 to the end: 11111010 + 1 = 11111011.\nDone! 11111011 is -5 in Two\'s Complement.',
          examinerTip: 'Ensure the final number is padded to a full 8 bits. Showing both the positive binary and the inverted step is required to achieve full method marks.',
          sampleAnswer: 'Step 1: Express +5 in 8-bit unsigned binary:\n00000101₂\n\nStep 2: Invert all bits (One\'s Complement):\n11111010₂\n\nStep 3: Add 1 to the least significant bit:\n11111010₂ + 1 = 11111011₂\n\nResult: -5 in 8-bit Two\'s Complement is 11111011₂.'
        },
        {
          subId: '5b',
          marks: 2,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain two significant limitations of One\'s Complement or Sign-Magnitude compared to Two\'s Complement.',
          textbookRef: 'Hodder p. 48 (PDF p. 58)',
          markScheme: [
            'Award [1] for identifying the dual representation of zero (+0 and -0) causing logic and conditional comparison errors (e.g. 00000000 vs 10000000 or 11111111).',
            'Award [1] for explaining that hardware arithmetic circuits require additional, complex logic to handle carry/subtraction instead of using standard binary adders.'
          ],
          easyExplanation: 'In Sign-Magnitude and One\'s Complement, you have TWO different zeros: positive zero and negative zero! This confuses software comparisons (is +0 equal to -0?). Additionally, you cannot just add positive and negative numbers together on a standard adder chip—you need extra bulky circuitry. Two\'s complement solves both problems perfectly with a single zero and standard addition logic.',
          examinerTip: 'Always mention the dual zero (+0 and -0) and the complexity it introduces into arithmetic and logical operations.',
          sampleAnswer: '1. Dual Representations of Zero: Both Sign-Magnitude (00000000₂ and 10000000₂) and One\'s Complement (00000000₂ and 11111111₂) have distinct positive and negative zeros, leading to wasted bit combinations and severe logical errors in equality comparisons.\n2. Inefficient Arithmetic Hardware: They cannot perform subtraction directly using standard binary adders; complex correction circuitry is required to handle end-around carries.'
        },
        {
          subId: '5c',
          marks: 3,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain why Gray Code (reflected binary code) is preferred over standard binary in rotary encoders for robotic arms.',
          textbookRef: 'Hodder p. 49 (PDF p. 59)',
          markScheme: [
            'Award [1] for defining Gray code: a binary encoding where any two successive numbers differ by only one single bit.',
            'Award [1] for identifying the problem with standard binary: multi-bit transitions (e.g., from 3 [011] to 4 [100] three bits flip simultaneously).',
            'Award [1] for explaining that mechanical vibrations or minor timing differences can cause transient false readings (glitches), whereas Gray code guarantees that only a single bit changes, ensuring sensor integrity.'
          ],
          easyExplanation: 'Imagine an angle dial rotating from position 3 (011) to position 4 (100). All 3 bits have to flip at the exact same nanosecond. In the real world, mechanical sensors vibrate. If one bit flips slightly before the others, the computer might momentarily read position 7 or 0, making the robot arm jerk violently! In Gray Code, each step only changes ONE bit (e.g., 010 to 110), so glitching is physically impossible.',
          examinerTip: 'Use a concrete numerical transition example, such as 3 (011₂) to 4 (100₂), to demonstrate the vulnerability of standard binary.',
          sampleAnswer: 'In standard binary, multiple bits frequently flip between consecutive numbers; for instance, transitioning from 3 (011₂) to 4 (100₂) requires three bits to change simultaneously. Due to mechanical vibration or tiny microsecond sensor timing discrepancies, the bits will not switch at the exact same instant, creating brief transient errors where the controller reads an entirely incorrect angle.\n\nGray Code prevents this because consecutive values differ by only ONE bit (e.g., 3 is 010₂ and 4 is 110₂). Only a single track switches at any boundary, completely eliminating transition noise and ensuring data integrity.'
        }
      ]
    },
    {
      id: 6,
      syllabusCode: 'A1.2.1',
      syllabusLabel: 'Principal Methods of Representing Data',
      topicTitle: 'Number Systems, Doubling Method & Hexadecimal',
      totalMarks: 8,
      contextScenario: 'A computer systems architect investigates architectural trade-offs between decimal, ternary, binary, and hexadecimal representations across computing generations.',
      subQuestions: [
        {
          subId: '6a',
          marks: 2,
          commandTerm: 'Outline',
          commandTermDef: 'Give a brief summary of essential features.',
          question: 'Outline two primary physical and logical reasons why modern computers use base-2 (binary) rather than base-10 (decimal) or base-3 (ternary Setun computer).',
          textbookRef: 'Hodder p. 24–25 (PDF p. 34–35)',
          markScheme: [
            'Award [1] for physical noise margin: Transistors naturally function as two-state electronic switches (ON/OFF or high/low voltage), providing wide noise margins that tolerate voltage fluctuations without data corruption.',
            'Award [1] for mathematical/logical correspondence: Two physical states map directly and unambiguously to Boolean logic (True and False, 1 and 0), enabling simple arithmetic logic unit (ALU) design.'
          ],
          easyExplanation: 'In electronics, it is extremely easy and reliable to distinguish between electricity ON vs electricity OFF. If a wire drops from 5.0 volts to 4.3 volts due to heat or static, binary still knows it is ON. In base-10, you would need 10 separate delicate voltage levels (e.g., 0.5V, 1.0V, 1.5V...), and tiny electrical noise would corrupt numbers constantly. Furthermore, ON and OFF match George Boole\'s True/False logic perfectly!',
          examinerTip: 'Focus on electrical noise immunity, voltage margins, and direct correspondence to Boolean algebra (True/False).',
          sampleAnswer: '1. Electrical Noise Immunity: Transistors operate reliably as two-state on/off switches. Having only two distinct voltage thresholds (HIGH and LOW) provides a large noise margin, preventing electrical static from causing bit-flip errors.\n2. Boolean Algebra Alignment: Two binary states directly implement Boolean logic (True = 1, False = 0), allowing complex mathematical computation to be constructed with simple semiconductor logic gates.'
        },
        {
          subId: '6b',
          marks: 3,
          commandTerm: 'Calculate',
          commandTermDef: 'Obtain a numerical result showing the relevant stages in the working.',
          question: 'Calculate the decimal equivalent of the 6-bit binary number 101011₂ using the Doubling Method. Show each step of running totals clearly.',
          textbookRef: 'Hodder p. 26–27 (PDF p. 36–37)',
          markScheme: [
            'Award [1] for initial setup and first 3 bit calculations: Bit 1 = 1; Bit 0 → (1 × 2) + 0 = 2; Bit 1 → (2 × 2) + 1 = 5.',
            'Award [1] for intermediate steps: Bit 0 → (5 × 2) + 0 = 10; Bit 1 → (10 × 2) + 1 = 21.',
            'Award [1] for final step and correct result: Bit 1 → (21 × 2) + 1 = 43.'
          ],
          easyExplanation: 'The Doubling Method is the trick processors use: Start from the leftmost bit. Double your total and add the next bit! Step 1: 1. Step 2: 1 × 2 + 0 = 2. Step 3: 2 × 2 + 1 = 5. Step 4: 5 × 2 + 0 = 10. Step 5: 10 × 2 + 1 = 21. Step 6: 21 × 2 + 1 = 43! Final answer: 43.',
          examinerTip: 'You must show each intermediate calculation (double & add). Simply writing 43 will only receive 1 mark.',
          sampleAnswer: 'Using the Doubling Method from MSB to LSB:\n• Step 1 (MSB = 1): Running total = 1\n• Step 2 (next bit = 0): (1 × 2) + 0 = 2\n• Step 3 (next bit = 1): (2 × 2) + 1 = 5\n• Step 4 (next bit = 0): (5 × 2) + 0 = 10\n• Step 5 (next bit = 1): (10 × 2) + 1 = 21\n• Step 6 (LSB = 1): (21 × 2) + 1 = 43\n\nResult: 101011₂ = 43₁₀.'
        },
        {
          subId: '6c',
          marks: 3,
          commandTerm: 'Convert & Explain',
          commandTermDef: 'Change into another form and give reasons or causes.',
          question: 'Convert the decimal number 156 into hexadecimal using repeated division by 16. Explain why hexadecimal is preferred over binary when inspecting memory addresses.',
          textbookRef: 'Hodder p. 28–30 (PDF p. 38–40)',
          markScheme: [
            'Award [1] for division step 1: 156 ÷ 16 = 9 remainder 12, mapping remainder 12 to hex digit C.',
            'Award [1] for division step 2: 9 ÷ 16 = 0 remainder 9 → result 9C₁₆.',
            'Award [1] for explanation: Exactly 4 binary bits (a nibble) correspond to 1 hexadecimal digit (2⁴ = 16). Hexadecimal compresses long 32-bit/64-bit binary memory dumps into concise, human-readable strings, drastically reducing visual clutter and transcription errors.'
          ],
          easyExplanation: '156 ÷ 16 = 9 with remainder 12. In hexadecimal, numbers 10–15 are letters A–F, so remainder 12 is \'C\'. Next, 9 ÷ 16 = 0 remainder 9. Reading bottom-to-top gives 9C₁₆!\nSoftware engineers love hex because every 4 binary bits turn into exactly 1 hex digit. Instead of reading an eye-watering memory address like 1001110001101111, you just read 9C6F.',
          examinerTip: 'Remember that remainder 12 must be written as \'C\'. Stating 912 is an immediate error.',
          sampleAnswer: '1. Repeated Division:\n• 156 ÷ 16 = 9 remainder 12. In hexadecimal, 12 = C.\n• 9 ÷ 16 = 0 remainder 9.\nReading remainders bottom-to-top gives: 9C₁₆.\n\n2. Explanation: Because 16 = 2⁴, each hexadecimal digit represents exactly 4 binary bits (one nibble). An 8-bit byte is represented by exactly 2 hex digits (1001 1100₂ = 9C₁₆). Hexadecimal allows software engineers to inspect memory addresses, MAC addresses, and color codes in a compact, human-readable format without tedious, error-prone 32-digit or 64-digit binary strings.'
        }
      ]
    },
    {
      id: 7,
      syllabusCode: 'A1.2.1',
      syllabusLabel: 'Principal Methods of Representing Data',
      topicTitle: 'Fixed-Point and Floating-Point Data Representations',
      totalMarks: 7,
      contextScenario: 'An avionics flight computer performs mathematical trajectory computations requiring both fixed-point and floating-point numeric formats.',
      subQuestions: [
        {
          subId: '7a',
          marks: 2,
          commandTerm: 'Distinguish',
          commandTermDef: 'Make clear the differences between two or more concepts or items.',
          question: 'Distinguish between fixed-point and floating-point representations of real numbers in binary.',
          textbookRef: 'Hodder p. 49–51 (PDF p. 59–61)',
          markScheme: [
            'Award [1] for fixed-point: The binary radix point has an unalterable, fixed position with a predetermined number of integer and fractional bits, offering rapid hardware execution but a severely restricted dynamic range.',
            'Award [1] for floating-point: The binary point floats dynamically using scientific notation (Sign × Mantissa × 2^Exponent), enabling an immense range of both infinitesimally small and astronomically large values at the expense of computational complexity.'
          ],
          easyExplanation: 'Fixed-point has the decimal dot cemented in place (like money: always 2 digits after the dot). Floating-point lets the dot move anywhere using scientific notation ($M \times 2^E$), allowing computers to represent both the size of an atom and the distance to Alpha Centauri using the same 32 bits.',
          examinerTip: 'Contrast the fixed radix position vs dynamic exponent/mantissa structure, and compare dynamic range vs hardware speed.',
          sampleAnswer: '1. Fixed-Point Representation: Allocates a fixed, unchangeable number of bits to the integer part and fractional part. The radix point never moves. It allows fast, simple integer arithmetic circuitry but has a very narrow dynamic range.\n2. Floating-Point Representation: Encodes real numbers in binary scientific notation using three components: Sign, Exponent, and Mantissa (Significand). The radix point moves according to the exponent, supporting an immense dynamic range from microscopic to astronomical values.'
        },
        {
          subId: '7b',
          marks: 2,
          commandTerm: 'Convert',
          commandTermDef: 'Change into another form.',
          question: 'Convert the 8-bit fixed-point binary number 0110.1100₂ (with 4 integer bits and 4 fractional bits) into its decimal equivalent. Show your working.',
          textbookRef: 'Hodder p. 49–50 (PDF p. 59–60)',
          markScheme: [
            'Award [1] for integer evaluation: (0 × 8) + (1 × 4) + (1 × 2) + (0 × 1) = 6.',
            'Award [1] for fractional evaluation: (1 × 0.5) + (1 × 0.25) + (0 × 0.125) + (0 × 0.0625) = 0.75, yielding final answer 6.75.'
          ],
          easyExplanation: 'Integer part (left of dot): 0110 = 4 + 2 = 6.\nFractional part (right of dot): Place values are 1/2, 1/4, 1/8, 1/16.\nSo .1100 = 1/2 (0.5) + 1/4 (0.25) = 0.75.\nAdd them together: 6 + 0.75 = 6.75!',
          examinerTip: 'Ensure students apply negative powers of 2 for fractional bits: 2⁻¹ = 0.5, 2⁻² = 0.25, 2⁻³ = 0.125, 2⁻⁴ = 0.0625.',
          sampleAnswer: '• Integer part: 0110₂ = (0 × 2³) + (1 × 2²) + (1 × 2¹) + (0 × 2⁰) = 4 + 2 = 6\n• Fractional part: .1100₂ = (1 × 2⁻¹) + (1 × 2⁻²) + (0 × 2⁻³) + (0 × 2⁻⁴) = 0.5 + 0.25 = 0.75\n\nTotal decimal value = 6 + 0.75 = 6.75.'
        },
        {
          subId: '7c',
          marks: 3,
          commandTerm: 'Explain & Outline',
          commandTermDef: 'Give reasons and provide essential features.',
          question: 'Explain how the IEEE 754 standard partitions 32-bit single-precision floating-point numbers. Outline why decimal fractions such as 0.1 cannot be stored with 100% precision in binary.',
          textbookRef: 'Hodder p. 50–51 (PDF p. 60–61)',
          markScheme: [
            'Award [1] for IEEE 754 bit layout: 1 bit for Sign, 8 bits for Biased Exponent (bias 127), and 23 bits for Normalized Mantissa/Fraction.',
            'Award [1] for explaining recurring binary fractions: Binary fractions are sums of powers of 2 (1/2, 1/4, 1/8...). Fractions whose simplified decimal denominator contains prime factors other than 2 (such as 1/10 = 1/(2 × 5)) result in an infinite repeating binary fraction (0.0001100110011...).',
            'Award [1] for outline of consequence: Because the mantissa has only 23 finite bits, the repeating bitstream is truncated, causing unavoidable round-off errors and precision drift in iterative calculations.'
          ],
          easyExplanation: 'IEEE 754 splits 32 bits into 1 sign bit, 8 exponent bits, and 23 mantissa bits. In decimal, 1/3 cannot be written exactly—it repeats forever as 0.333333... In binary, 1/10 (0.1) does the exact same thing: 0.0001100110011... repeating forever! Because the computer only has 23 bits of precision, it must cut it off, creating tiny roundoff errors (e.g. 0.1 + 0.2 = 0.30000000000000004).',
          examinerTip: 'State the specific field bit counts (1 sign, 8 exponent, 23 mantissa) and refer to recurring binary sequences due to non-power-of-2 prime factors in base 10.',
          sampleAnswer: '1. IEEE 754 32-bit Partitioning: The 32 bits are divided into:\n• Sign bit: 1 bit (0 = positive, 1 = negative)\n• Exponent: 8 bits (biased by 127 to handle negative powers)\n• Mantissa (fraction): 23 bits (stores normalized significand with an implicit leading 1).\n\n2. Lack of Exact Precision for 0.1: A fractional value can only be represented exactly in binary if its denominator is a pure power of 2. The decimal fraction 0.1 = 1/10 has a prime factor of 5. Converting 0.1 to binary produces an infinitely repeating recurring sequence: 0.00011001100110011...₂. Because the mantissa has only 23 finite storage bits, the recurring sequence must be truncated, introducing a tiny unavoidable rounding discrepancy.'
        }
      ]
    },
    {
      id: 8,
      syllabusCode: 'A1.2.3',
      syllabusLabel: 'Purpose and Use of Logic Gates',
      topicTitle: 'Transistors, Logic Gates & Universal Gating',
      totalMarks: 8,
      contextScenario: 'A semiconductor foundry designs CMOS microchips utilizing basic and derived logic gates formed from microscopic electronic switches.',
      subQuestions: [
        {
          subId: '8a',
          marks: 2,
          commandTerm: 'Outline',
          commandTermDef: 'Give a brief summary of essential features.',
          question: 'Outline the historical contribution of Claude Shannon (1937) in linking George Boole’s mathematical algebra with physical electrical circuits.',
          textbookRef: 'Hodder p. 51–52 (PDF p. 61–62)',
          markScheme: [
            'Award [1] for recognizing that electrical switches/relays can directly represent Boolean binary states (closed/ON = 1/True, open/OFF = 0/False).',
            'Award [1] for proving that any logical Boolean equation and arithmetic operation can be constructed mechanically or electronically by wiring switches in series and parallel.'
          ],
          easyExplanation: 'In 1854, George Boole invented logic math (True and False). In 1937, 21-year-old Claude Shannon proved that physical electrical switches (ON = 1, OFF = 0) could solve Boole\'s math! He proved you could build an electronic brain by wiring simple switches together.',
          examinerTip: 'Connect George Boole\'s Boolean algebra to electrical switching circuits (relays/transistors) and digital logic implementation.',
          sampleAnswer: 'In his 1937 Master\'s thesis, Claude Shannon demonstrated that electrical relays and switches could physically implement Boolean algebra: closed switches represent True (1) and open switches represent False (0). He proved that combining electronic switches in series and parallel allows physical hardware to execute complex logical deductions and binary arithmetic, laying the foundation for all modern digital computing.'
        },
        {
          subId: '8b',
          marks: 3,
          commandTerm: 'Explain & Contrast',
          commandTermDef: 'Give reasons and make clear differences.',
          question: 'Explain how physical transistors function as electronic switches. Contrast the circuit layout of an AND gate with an OR gate at the transistor level.',
          textbookRef: 'Hodder p. 52–54 (PDF p. 62–64)',
          markScheme: [
            'Award [1] for transistor function: A transistor acts as a solid-state switch with no moving parts; applying a control voltage to the base (gate) creates an electrical path, allowing current to flow between collector and emitter.',
            'Award [1] for AND gate layout: Two transistors connected in series; electric current can only flow to the output if BOTH transistors are turned ON simultaneously by their input voltages (A · B).',
            'Award [1] for OR gate layout: Two transistors connected in parallel; electric current flows to the output if EITHER (or both) transistors are turned ON by their input voltages (A + B).'
          ],
          easyExplanation: 'A transistor is a light switch controlled by electricity instead of your finger: when you put voltage into the base wire, it opens the gate for electricity to flow through. To make an AND gate, place two transistors in a single line (SERIES)—electricity only reaches the output if BOTH are ON. To make an OR gate, place them side-by-side (PARALLEL)—electricity reaches the output if EITHER transistor is ON!',
          examinerTip: 'Use the terms "in series" for AND gates and "in parallel" for OR gates. Emphasize that transistors have no moving parts.',
          sampleAnswer: '1. Transistor as a Switch: A transistor operates as a solid-state electronic switch. When a small control voltage is applied to its base input, the semiconductor conducts, allowing electrical current to flow freely between its collector and emitter with zero moving parts.\n2. AND Gate (Series Layout): Two transistors are connected in series along a single conductive path. Output current is delivered only when transistor A AND transistor B are both activated (A · B = 1).\n3. OR Gate (Parallel Layout): Two transistors are connected in parallel. If either transistor A OR transistor B conducts, a current pathway to the output is established (A + B = 1).'
        },
        {
          subId: '8c',
          marks: 3,
          commandTerm: 'Define & Demonstrate',
          commandTermDef: 'Give precise meaning and show through reasoning or diagrams.',
          question: 'Define what is meant by a "universal logic gate". Demonstrate how a NOT gate and an AND gate can be constructed using only 2-input NAND gates.',
          textbookRef: 'Hodder p. 54–55 (PDF p. 64–65)',
          markScheme: [
            'Award [1] for definition: A universal gate is a logic gate (specifically NAND or NOR) that can be combined to implement ANY fundamental Boolean function (AND, OR, NOT, XOR) without requiring any other gate type.',
            'Award [1] for NOT gate construction: Connect both inputs of a 2-input NAND gate together (or tie one input to logic 1/HIGH); this produces output X = (A · A)̄ = Ā.',
            'Award [1] for AND gate construction: Connect a 2-input NAND gate followed immediately by a NOT gate (made from a second NAND gate with joined inputs); the double negation cancels: ((A · B)̄)̄ = A · B.'
          ],
          easyExplanation: 'A "universal gate" is like the master key of computing—if you only manufactured NAND gates, you could build any supercomputer in the world! To make a NOT gate: tie both input pins of a NAND gate together. When input is 1, output is 0; when input is 0, output is 1. To make an AND gate: take a NAND gate, and plug its output into your NAND-made NOT gate. Two negatives cancel out, giving you pure AND!',
          examinerTip: 'State that NAND and NOR are universal gates. Show the double-inversion identity NOT(NAND(A, B)) = AND(A, B).',
          sampleAnswer: '1. Universal Gate Definition: A universal logic gate is a gate that can be interconnected to recreate all other Boolean logic operations (AND, OR, NOT, XOR) without needing any other components. NAND and NOR are universal gates.\n2. Constructing a NOT Gate: Connect both inputs of a 2-input NAND gate together so they receive the same signal A. By Boolean identity, (A · A)̄ = Ā (an inverter).\n3. Constructing an AND Gate: Pass inputs A and B into a NAND gate to produce (A · B)̄. Then feed this intermediate output into a second NAND gate configured as an inverter (tied inputs). Inverting the inverted signal yields: ((A · B)̄)̄ = A · B.'
        }
      ]
    },
    {
      id: 9,
      syllabusCode: 'A1.2.4',
      syllabusLabel: 'Construct and Analyse Truth Tables',
      topicTitle: 'Truth Table Construction & Karnaugh Maps',
      totalMarks: 8,
      contextScenario: 'An automated industrial petrochemical refinery regulates emergency safety valves and cooling systems using multi-input logic networks.',
      subQuestions: [
        {
          subId: '9a',
          marks: 2,
          commandTerm: 'State & Explain',
          commandTermDef: 'Give specific name/value and provide reasons/mechanisms.',
          question: 'State the mathematical formula used to calculate the number of rows in a truth table for an n-input circuit. Explain the standard systematic pattern used by computer scientists to fill in input columns to avoid omissions.',
          textbookRef: 'Hodder p. 56–57 (PDF p. 66–67)',
          markScheme: [
            'Award [1] for row formula: Number of rows = 2ⁿ (where n is the number of distinct binary inputs).',
            'Award [1] for systematic pattern: Input rows follow ascending binary counting (0 to 2ⁿ - 1). The rightmost input column alternates single 0s and 1s (0, 1, 0, 1...); the next column alternates in pairs (0, 0, 1, 1...); the leftmost column alternates in groups of four (0, 0, 0, 0, 1, 1, 1, 1...), ensuring all 2ⁿ permutations are represented without duplication or omission.'
          ],
          easyExplanation: 'Formula: 2ⁿ rows (e.g., 3 inputs = 2³ = 8 rows). To never miss a combination, count in binary from 0 to 7! The right column blinks every 1 step (0,1,0,1...). The middle column blinks every 2 steps (0,0,1,1...). The left column blinks every 4 steps (0,0,0,0,1,1,1,1...).',
          examinerTip: 'Always write inputs in standard ascending binary order (000 to 111) to avoid confusing examiners and losing partial credit.',
          sampleAnswer: '1. Row Formula: Total rows = 2ⁿ, where n is the number of binary input variables (e.g. 3 inputs require 2³ = 8 rows).\n2. Systematic Pattern: Input rows represent consecutive binary numbers from 0 up to 2ⁿ - 1. Working from right to left: the least significant column alternates every 1 row (0, 1, 0, 1...), the next column alternates every 2 rows (0, 0, 1, 1...), and the most significant column alternates every 4 rows (0, 0, 0, 0, 1, 1, 1, 1...). This guarantees that every possible input combination is systematically listed exactly once.'
        },
        {
          subId: '9b',
          marks: 4,
          commandTerm: 'Construct',
          commandTermDef: 'Display information in a diagrammatic or logical form.',
          question: 'An automated reactor safety cooling valve (V) opens (V = 1) under the following condition: Reactor Pressure is High (A = 1) AND (Coolant Temperature is High (B = 1) OR Emergency Override is Engaged (C = 1)). Construct the complete 8-row truth table for this system, including the intermediate column P = (B + C) and final valve output V = A · P.',
          textbookRef: 'Hodder p. 58–60 (PDF p. 68–70)',
          markScheme: [
            'Award [1] for correct 8 input rows (000 through 111).',
            'Award [1] for correct intermediate column P = B + C: 0, 1, 1, 1, 0, 1, 1, 1.',
            'Award [1] for correct final column V = A · P: 0, 0, 0, 0, 0, 1, 1, 1.',
            'Award [1] for deduction: Valve V is only energized (V=1) for input states 101, 110, and 111.'
          ],
          easyExplanation: 'Intermediate step P = B OR C: If B is 1 or C is 1, P is 1 (rows 2,3,4 and 6,7,8). Final step V = A AND P: Needs BOTH A=1 and P=1. In the first 4 rows, A is 0, so V is 0! In the last 4 rows, A is 1, so V is 1 whenever P is 1 (rows 6, 7, 8).',
          examinerTip: 'Always include the intermediate column P. If a student makes an arithmetic slip in the final column, intermediate columns preserve 2 out of 4 method marks.',
          sampleAnswer: 'Complete Truth Table for V = A · (B + C):\n\nRow | A | B | C | P = (B + C) | V = A · P\n----+---+---+---+-------------+----------\n 1  | 0 | 0 | 0 |      0      |    0\n 2  | 0 | 0 | 1 |      1      |    0\n 3  | 0 | 1 | 0 |      1      |    0\n 4  | 0 | 1 | 1 |      1      |    0\n 5  | 1 | 0 | 0 |      0      |    0\n 6  | 1 | 0 | 1 |      1      |    1\n 7  | 1 | 1 | 0 |      1      |    1\n 8  | 1 | 1 | 1 |      1      |    1\n\nThe valve V opens only in rows 6, 7, and 8 where A=1 and at least one of B or C is 1.'
        },
        {
          subId: '9c',
          marks: 2,
          commandTerm: 'Explain',
          commandTermDef: 'Give a detailed account including reasons or causes.',
          question: 'Explain why the column headings in a Karnaugh map (K-map) are arranged in Gray code order (00, 01, 11, 10) instead of conventional binary counting (00, 01, 10, 11).',
          textbookRef: 'Hodder p. 61–65 (PDF p. 71–75)',
          markScheme: [
            'Award [1] for Gray code property: Gray code guarantees that only a single binary variable changes state between any two adjacent cells (Hamming distance of 1).',
            'Award [1] for simplification mechanism: Because only one variable changes between adjacent cells, grouping adjacent 1s in powers of two eliminates that changing variable based on the Boolean identity (X · Y + X · Ȳ = X).'
          ],
          easyExplanation: 'In normal binary, going from 01 to 10 flips TWO bits at once. That would ruin K-maps! Gray code goes 00 → 01 → 11 → 10, flipping only ONE bit per step. Because only one letter changes between neighbor cells, circling two adjacent 1s cancels out that changing letter completely, shrinking your circuit!',
          examinerTip: 'Emphasize that only one variable changes between adjacent cells and cite the Boolean cancellation identity X · Y + X · Ȳ = X.',
          sampleAnswer: 'In standard binary counting, transitioning from 01 to 10 changes two variables simultaneously. In contrast, Gray code ordering (00, 01, 11, 10) ensures that only one single variable changes state between any adjacent horizontal or vertical cells. This single-bit transition property allows adjacent cells containing 1s to be combined into rectangular groups (powers of 2), algebraically eliminating the variable that changes state according to the rule A · B + A · B̄ = A.'
        }
      ]
    },
    {
      id: 10,
      syllabusCode: 'A1.2.5',
      syllabusLabel: 'Construct Logic Diagrams',
      topicTitle: 'Constructing and Tracing Logic Diagrams',
      totalMarks: 8,
      contextScenario: 'An aerospace hardware engineer constructs combinational logic diagrams for arithmetic adders and biometric safety interlocks.',
      subQuestions: [
        {
          subId: '10a',
          marks: 4,
          commandTerm: 'State, Describe & Evaluate',
          commandTermDef: 'Give names/expressions, detail layout, and calculate result.',
          question: 'A 1-bit Half-Adder adds two binary inputs A and B, producing a Sum bit (S) and a Carry bit (C). State the Boolean expressions for S and C, describe the gate architecture of the logic diagram, and evaluate the outputs for test input vector A = 1, B = 1.',
          textbookRef: 'Hodder p. 65–66 (PDF p. 75–76)',
          markScheme: [
            'Award [1] for Sum expression: S = A ⊕ B (2-input XOR gate).',
            'Award [1] for Carry expression: C = A · B (2-input AND gate).',
            'Award [1] for gate architecture: Inputs A and B are split in parallel to feed both a 2-input XOR gate (whose output is S) and a 2-input AND gate (whose output is C).',
            'Award [1] for evaluation: For A=1, B=1: S = 1 ⊕ 1 = 0; C = 1 · 1 = 1 (representing binary 10₂ = 2₁₀).'
          ],
          easyExplanation: 'When you add 1 + 1 in binary, the answer is 2 (written as 10 in binary). The units place is 0 (Sum) and the carry to the next column is 1 (Carry). An XOR gate gives 1 only when inputs are DIFFERENT, so 1 ⊕ 1 = 0 (Sum). An AND gate gives 1 only when BOTH inputs are 1, so 1 · 1 = 1 (Carry)!',
          examinerTip: 'State both the Boolean operator symbols (⊕ and ·) and the gate names (XOR and AND). Test with A=1, B=1 and verify S=0, C=1.',
          sampleAnswer: '1. Boolean Expressions:\n• Sum: S = A ⊕ B (XOR gate)\n• Carry: C = A · B (AND gate)\n\n2. Gate Architecture: Inputs A and B are connected in parallel to two logic gates. One branch feeds both A and B into a 2-input XOR gate to produce the Sum output S. A second branch feeds A and B into a 2-input AND gate to produce the Carry output C.\n\n3. Evaluation for A = 1, B = 1:\n• Sum: S = 1 ⊕ 1 = 0\n• Carry: C = 1 · 1 = 1\nOutputs: S = 0, C = 1 (representing binary 10₂ = 2₁₀).'
        },
        {
          subId: '10b',
          marks: 4,
          commandTerm: 'Describe & Identify',
          commandTermDef: 'Detail sequence of stages and recognize equivalence.',
          question: 'A digital security latch illuminates an unlock indicator (Y) based on the Boolean equation: Y = (A · B) + (Ā · B̄). Describe the step-by-step gate layout needed to construct this logic diagram, and identify the single derived logic gate that can replace this entire 5-gate circuit.',
          textbookRef: 'Hodder p. 65–66 (PDF p. 75–76)',
          markScheme: [
            'Award [1] for upper branch: Connect inputs A and B directly into a 2-input AND gate to compute the term (A · B).',
            'Award [1] for lower branch: Pass input A through a NOT gate to produce Ā, and pass input B through a NOT gate to produce B̄; feed both inverted lines into a second 2-input AND gate to compute (Ā · B̄).',
            'Award [1] for output stage: Connect the outputs of both AND gates into a 2-input OR gate to generate final output Y.',
            'Award [1] for equivalent gate identification: XNOR (Exclusive-NOR or Equivalence) gate, which outputs 1 whenever inputs A and B have identical logic states.'
          ],
          easyExplanation: 'To build Y = (A · B) + (Ā · B̄):\n1. Upper path: wire A and B into an AND gate.\n2. Lower path: put A through a NOT gate, put B through a NOT gate, wire both into another AND gate.\n3. Final step: wire both AND gate outputs into an OR gate.\nNotice that this circuit turns ON whenever both inputs match (both 0 or both 1). That is the exact definition of an XNOR gate!',
          examinerTip: 'Describe the circuit in clean layers: Inverters → AND gates → OR gate. Recognize the equivalence to XNOR / equivalence gate.',
          sampleAnswer: '1. Step-by-Step Gate Construction:\n• Layer 1 (Upper Branch): Connect inputs A and B directly into a 2-input AND gate to evaluate (A · B).\n• Layer 1 & 2 (Lower Branch): Feed input A into a NOT gate to generate Ā, and input B into a second NOT gate to generate B̄. Connect both inverted outputs into another 2-input AND gate to evaluate (Ā · B̄).\n• Layer 3 (Output Combination): Feed the outputs of both AND gates into a 2-input OR gate to produce the final signal Y = (A · B) + (Ā · B̄).\n\n2. Single Equivalent Gate: This circuit can be replaced by a single XNOR (Exclusive-NOR) gate (Y = (A ⊕ B)̄), which outputs 1 whenever both inputs are equal (00 or 11).'
        }
      ]
    }
  ];

  // Helper to toggle answer revelation
  const toggleAnswer = (key: string) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const revealAll = () => {
    const allKeys: { [k: string]: boolean } = {};
    questions.forEach(q => {
      q.subQuestions.forEach(sq => {
        allKeys[sq.subId] = true;
      });
    });
    setRevealedAnswers(allKeys);
  };

  const hideAll = () => {
    setRevealedAnswers({});
  };

  const updateScore = (subId: string, maxMarks: number, score: number) => {
    setStudentScores(prev => ({
      ...prev,
      [subId]: Math.max(0, Math.min(maxMarks, score))
    }));
  };

  const totalPossibleMarks = questions.reduce((acc, q) => acc + q.totalMarks, 0);
  const currentTotalScore = Object.values(studentScores).reduce((a, b) => a + b, 0);

  // Collect all sub-questions across the exam paper
  const allSubQuestions = questions.flatMap(q => q.subQuestions);
  const totalSubQuestionsCount = allSubQuestions.length;

  const isSubQuestionAnswered = (subId: string) => {
    const hasScore = studentScores[subId] !== undefined;
    const hasNote = studentNotes[subId] && studentNotes[subId].trim().length > 0;
    return Boolean(hasScore || hasNote);
  };

  const answeredCount = allSubQuestions.filter(sq => isSubQuestionAnswered(sq.subId)).length;
  const masteredCount = allSubQuestions.filter(sq => studentScores[sq.subId] === sq.marks).length;

  // Build topic breakdown
  const topicBreakdown: TopicProgressSummary[] = questions.map(q => {
    const qSubQuestions = q.subQuestions;
    const answeredSub = qSubQuestions.filter(sq => isSubQuestionAnswered(sq.subId)).length;
    const masteredSub = qSubQuestions.filter(sq => studentScores[sq.subId] === sq.marks).length;
    const earnedMarks = qSubQuestions.reduce((acc, sq) => acc + (studentScores[sq.subId] || 0), 0);
    return {
      topicId: q.id,
      title: `${q.syllabusCode}: ${q.topicTitle.split('(')[0].trim()}`,
      totalSubQuestions: qSubQuestions.length,
      answeredSubQuestions: answeredSub,
      masteredSubQuestions: masteredSub,
      earnedMarks,
      maxMarks: q.totalMarks
    };
  });

  const jumpToFirstUnanswered = () => {
    const firstUnanswered = allSubQuestions.find(sq => !isSubQuestionAnswered(sq.subId));
    if (firstUnanswered) {
      if (statusFilter === 'answered') {
        setStatusFilter('all');
      }
      setTimeout(() => {
        const el = document.getElementById(`subq_${firstUnanswered.subId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-cyan-400');
          setTimeout(() => el.classList.remove('ring-2', 'ring-cyan-400'), 2500);
        }
      }, 50);
    }
  };

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset all your exam scores and written responses?')) {
      setStudentScores({});
      setStudentNotes({});
      setRevealedAnswers({});
      try {
        localStorage.removeItem('ib_exam_scores_all');
        localStorage.removeItem('ib_exam_notes_all');
        localStorage.removeItem('ib_exam_scores_a122');
        localStorage.removeItem('ib_exam_notes_a122');
      } catch {}
    }
  };

  const filteredQuestions = filterTopic === 'all' 
    ? questions 
    : questions.filter(q => q.syllabusCode === filterTopic || q.topicTitle.toLowerCase().includes(filterTopic.toLowerCase()));

  // Syllabus badge styling helper
  const getBadgeStyle = (code: string) => {
    switch (code) {
      case 'A1.2.1':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/80';
      case 'A1.2.2':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800/80';
      case 'A1.2.3':
        return 'bg-amber-950 text-amber-300 border-amber-800/80';
      case 'A1.2.4':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800/80';
      case 'A1.2.5':
        return 'bg-rose-950 text-rose-300 border-rose-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto print:max-w-none">
      {/* Official IB DP Examination Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                International Baccalaureate Diploma Programme
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                Paper 1 Practice Exam
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Topics A1.2.1 – A1.2.5 Examination Suite
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Curriculum Source: <strong>Computer Science for the IB Diploma (Hodder Education, Baumgarten, Ganea, Turland)</strong>, pp. 24–66.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
              title="Print Exam Paper"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Paper</span>
            </button>
            <button
              onClick={revealAll}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              Reveal All Solutions
            </button>
            <button
              onClick={hideAll}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Estimated Exam Time: 75 Minutes</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalPossibleMarks} Marks Total ({totalSubQuestionsCount} Sub-Questions)</span>
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Progress & Scratchpad Saved in Browser
          </span>
        </div>
      </div>

      {/* Dedicated Interactive Progress & Mastery Tracker Component */}
      <ExamProgressTracker
        totalQuestions={totalSubQuestionsCount}
        answeredCount={answeredCount}
        masteredCount={masteredCount}
        totalMarksEarned={currentTotalScore}
        maxTotalMarks={totalPossibleMarks}
        topicBreakdown={topicBreakdown}
        onJumpToUnanswered={jumpToFirstUnanswered}
        onResetProgress={resetAllProgress}
        onFilterStatus={setStatusFilter}
        currentFilterStatus={statusFilter}
      />

      {/* Filter Tabs by IB Syllabus Topic */}
      <div className="flex items-center gap-2 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-x-auto text-xs">
        <span className="text-slate-400 font-semibold px-2 shrink-0">Filter Topic:</span>
        {[
          { key: 'all', label: `All 10 Questions (${totalPossibleMarks} Marks)` },
          { key: 'A1.2.1', label: 'A1.2.1 Number Systems' },
          { key: 'A1.2.2', label: 'A1.2.2 Binary Storage' },
          { key: 'A1.2.3', label: 'A1.2.3 Logic Gates' },
          { key: 'A1.2.4', label: 'A1.2.4 Truth Tables' },
          { key: 'A1.2.5', label: 'A1.2.5 Logic Diagrams' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilterTopic(item.key)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              filterTopic === item.key 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Questions Container */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          // Filter subquestions based on status filter
          const visibleSubQuestions = q.subQuestions.filter(sq => {
            if (statusFilter === 'unanswered') return !isSubQuestionAnswered(sq.subId);
            if (statusFilter === 'answered') return isSubQuestionAnswered(sq.subId);
            return true;
          });

          if (visibleSubQuestions.length === 0) return null;

          return (
            <div 
              key={q.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6"
            >
              {/* Question Group Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-300 font-mono font-bold flex items-center justify-center border border-cyan-800">
                    {q.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getBadgeStyle(q.syllabusCode)}`}>
                        {q.syllabusCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {q.syllabusLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Question {q.id}: {q.topicTitle}
                    </h3>
                    {q.contextScenario && (
                      <p className="text-xs text-slate-300 italic mt-0.5">
                        "{q.contextScenario}"
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shrink-0">
                  [{q.totalMarks} Marks]
                </span>
              </div>

              {/* Sub-Questions */}
              <div className="space-y-6">
                {visibleSubQuestions.map((sq) => {
                  const isRevealed = revealedAnswers[sq.subId] || false;
                  const currentScore = studentScores[sq.subId] ?? 0;
                  const isAnswered = isSubQuestionAnswered(sq.subId);
                  const isMastered = studentScores[sq.subId] === sq.marks;

                  return (
                    <div 
                      key={sq.subId} 
                      id={`subq_${sq.subId}`}
                      className={`p-4 rounded-2xl border transition-all ${
                        isMastered
                          ? 'bg-slate-950/80 border-emerald-800/60 shadow-sm shadow-emerald-950/20'
                          : isAnswered
                          ? 'bg-slate-950/80 border-cyan-800/50'
                          : 'bg-slate-950/70 border-slate-800/80'
                      } space-y-4`}
                    >
                      {/* Sub-question Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-bold text-sm">({sq.subId})</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                              Command Term: {sq.commandTerm}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden md:inline">({sq.commandTermDef})</span>
                            
                            {isMastered ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mastered ({sq.marks}/{sq.marks})
                              </span>
                            ) : isAnswered ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1 font-semibold">
                                ✓ Answered
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-100 font-medium leading-relaxed">
                            {sq.question}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-amber-400 text-xs">[{sq.marks} marks]</span>
                          <button
                            onClick={() => toggleAnswer(sq.subId)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              isRevealed
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isRevealed ? 'Hide Solution' : 'Show Solution'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Student Scratchpad / Answer Area */}
                      {!isRevealed && (
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-slate-400 block">
                            Candidate Working & Response:
                          </label>
                          <textarea
                            rows={2}
                            value={studentNotes[sq.subId] || ''}
                            onChange={(e) => setStudentNotes({ ...studentNotes, [sq.subId]: e.target.value })}
                            placeholder="Type your IB exam response or calculation working here..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 resize-y"
                          />
                        </div>
                      )}

                      {/* Revealed Markscheme & Easy Explanation Box */}
                      {isRevealed && (
                        <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fade-in">
                          {/* Sample IB Model Answer */}
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-900/50 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                Official IB Model Response:
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Ref: {sq.textbookRef}
                              </span>
                            </div>
                            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-sans text-slate-200 whitespace-pre-line leading-relaxed">
                              {sq.sampleAnswer}
                            </div>
                          </div>

                          {/* Official Mark Scheme Points */}
                          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                              Examiner Mark Scheme:
                            </span>
                            <ul className="space-y-1 text-xs text-slate-300">
                              {sq.markScheme.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="text-amber-400 font-bold">•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Easy Explanation in Plain English */}
                          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                              <Sparkles className="w-4 h-4" />
                              <span>Easy Plain-English Explanation:</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {sq.easyExplanation}
                            </p>
                          </div>

                          {/* Common Mistake & Examiner Tip */}
                          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-300">Common Examiner Trap / Pitfall:</strong>
                              <p className="text-[11px] text-amber-300/80 mt-0.5">{sq.examinerTip}</p>
                            </div>
                          </div>

                          {/* Self-Scoring Marks Selector */}
                          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">
                              Self-Assessment Marks Awarded:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {Array.from({ length: sq.marks + 1 }, (_, i) => i).map((markVal) => (
                                <button
                                  key={markVal}
                                  onClick={() => updateScore(sq.subId, sq.marks, markVal)}
                                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold transition-all ${
                                    currentScore === markVal
                                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  {markVal}
                                </button>
                              ))}
                              <span className="text-xs font-mono text-slate-400 ml-1">/ {sq.marks}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
