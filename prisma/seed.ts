import { PrismaClient, Role, Difficulty, QuestionType, VideoProvider, QuizAccessMode, ResultVisibility } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for Riffat\'s Classroom...');

  // 1. Cleanup existing records cleanly in reverse dependency order
  await prisma.attemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.dailyChallengeInstance.deleteMany();
  await prisma.dailyChallengeSchedule.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.certificateTemplate.deleteMany();
  await prisma.courseLesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lessonAsset.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.forumCategory.deleteMany();
  await prisma.directMessage.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.studentStreak.deleteMany();
  await prisma.guardianStudentLink.deleteMany();
  await prisma.cohortMember.deleteMany();
  await prisma.cohort.deleteMany();
  await prisma.notice.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  console.log('Creating initial users...');
  
  // Lead Teacher & Super Admin
  const teacherRiffat = await prisma.user.create({
    data: {
      name: 'Riffat Sultana',
      bengaliName: 'রিফাত সুলতানা',
      email: 'riffat@riffatsclassroom.com',
      image: '/images/logo.png',
      gradeLevel: 'Teacher / Lead Instructor',
      isActive: true,
      roles: {
        create: [
          { role: Role.SUPER_ADMIN },
          { role: Role.ADMIN },
          { role: Role.TEACHER }
        ]
      }
    }
  });

  // Second Teacher
  const teacherTanvir = await prisma.user.create({
    data: {
      name: 'Tanvir Ahmed',
      bengaliName: 'তানভীর আহমেদ',
      email: 'tanvir@riffatsclassroom.com',
      gradeLevel: 'High School English Specialist',
      isActive: true,
      roles: {
        create: [{ role: Role.TEACHER }]
      }
    }
  });

  // Student 1 (Abrar)
  const studentAbrar = await prisma.user.create({
    data: {
      name: 'Abrar Fahim',
      bengaliName: 'আবরার ফাহিম',
      email: 'abrar@student.test',
      gradeLevel: 'Class 8',
      isActive: true,
      roles: {
        create: [{ role: Role.STUDENT }]
      },
      streak: {
        create: {
          currentStreak: 5,
          longestStreak: 12,
          lastActiveDate: new Date(),
          totalChallengesCompleted: 14
        }
      }
    }
  });

  // Student 2 (Samiha)
  const studentSamiha = await prisma.user.create({
    data: {
      name: 'Samiha Noor',
      bengaliName: 'সামিহা নূর',
      email: 'samiha@student.test',
      gradeLevel: 'Class 7',
      isActive: true,
      roles: {
        create: [{ role: Role.STUDENT }]
      },
      streak: {
        create: {
          currentStreak: 3,
          longestStreak: 7,
          lastActiveDate: new Date(),
          totalChallengesCompleted: 8
        }
      }
    }
  });

  // Guardian
  const guardianKazi = await prisma.user.create({
    data: {
      name: 'Dr. Kazi Fahim',
      email: 'guardian@family.test',
      phoneNumber: '+8801700000000',
      isActive: true,
      roles: {
        create: [{ role: Role.GUARDIAN }]
      }
    }
  });

  // Link Guardian to Abrar
  await prisma.guardianStudentLink.create({
    data: {
      guardianId: guardianKazi.id,
      studentId: studentAbrar.id,
      relationship: 'Father',
      isApproved: true
    }
  });

  // 3. Academic Hierarchy: Subject -> Topics -> Subtopics
  console.log('Creating academic hierarchy...');
  const englishSubject = await prisma.subject.create({
    data: {
      name: 'English Grammar & Language',
      slug: 'english-grammar',
      description: 'Comprehensive English language learning tailored for school curricula in Bangladesh and global fluency.',
      icon: 'BookOpen'
    }
  });

  // Topic 1: Sentence Structure
  const topicSentence = await prisma.topic.create({
    data: {
      subjectId: englishSubject.id,
      name: 'Sentence Structure & Building',
      slug: 'sentence-structure',
      orderIndex: 1,
      subtopics: {
        create: [
          { name: 'Subject and Object Identification', slug: 'subject-object-identification' },
          { name: 'Direct and Indirect Objects', slug: 'direct-indirect-objects' },
          { name: 'Types of Sentences (Assertive, Interrogative, Imperative, Optative, Exclamatory)', slug: 'types-of-sentences' },
          { name: 'Affirmative and Negative Transformations', slug: 'affirmative-negative-transformations' }
        ]
      }
    }
  });

  // Topic 2: Articles & Determiners
  const topicArticles = await prisma.topic.create({
    data: {
      subjectId: englishSubject.id,
      name: 'Articles: A, An, The',
      slug: 'articles',
      orderIndex: 2,
      subtopics: {
        create: [
          { name: 'Indefinite Articles: A and An', slug: 'indefinite-articles' },
          { name: 'Definite Article: The', slug: 'definite-article' },
          { name: 'Omission of Articles (Zero Article)', slug: 'omission-of-articles' }
        ]
      }
    }
  });

  // Topic 3: Questions
  const topicQuestions = await prisma.topic.create({
    data: {
      subjectId: englishSubject.id,
      name: 'WH & Yes/No Questions',
      slug: 'question-formation',
      orderIndex: 3,
      subtopics: {
        create: [
          { name: 'Forming Yes/No Questions', slug: 'yes-no-questions' },
          { name: 'Forming WH-Questions (Who, What, Where, When, Why, How)', slug: 'wh-questions' }
        ]
      }
    }
  });

  // Topic 4: Parts of Speech & Verbs
  const topicPartsOfSpeech = await prisma.topic.create({
    data: {
      subjectId: englishSubject.id,
      name: 'Parts of Speech & Tenses',
      slug: 'parts-of-speech-tenses',
      orderIndex: 4,
      subtopics: {
        create: [
          { name: 'Subject-Verb Agreement', slug: 'subject-verb-agreement' },
          { name: 'Prepositions in Daily English', slug: 'prepositions' },
          { name: 'Common Tense Traps', slug: 'tense-traps' }
        ]
      }
    }
  });

  // 4. Lessons (CMS)
  console.log('Creating educational lessons...');
  
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Mastering Sentences: Subject and Object Identification',
      slug: 'mastering-sentences-subject-and-object',
      summary: 'Learn how to easily find the Subject (who is acting) and the Object (who receives the action) in any English sentence.',
      gradeLevel: 'Class 6 - 9',
      difficulty: Difficulty.BEGINNER,
      subjectId: englishSubject.id,
      topicId: topicSentence.id,
      teacherId: teacherRiffat.id,
      durationMinutes: 20,
      isPublished: true,
      publishedAt: new Date(),
      videoProvider: VideoProvider.YOUTUBE,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Standard embed format
      thumbnailUrl: '/images/logo.png',
      content: `
        <h2>Welcome to Mastering Sentences!</h2>
        <p>In English, every complete sentence consists of at least a <strong>Subject</strong> and a <strong>Predicate</strong>.</p>
        
        <h3>1. What is the Subject?</h3>
        <p>The subject is the person, animal, or thing that <em>performs the action</em> or is being described.</p>
        <div class="bg-pink-50 p-4 rounded-xl border border-pink-200 my-4">
          <p><strong>Example:</strong> <em>Riffat</em> teaches English with joy.</p>
          <p class="text-sm text-pink-700">Here, "Riffat" is the Subject because she performs the action of teaching.</p>
        </div>

        <h3>2. What is the Object?</h3>
        <p>The object is the noun or pronoun that <em>receives the action</em> of the verb. To find the object, ask <strong>"What?"</strong> or <strong>"Whom?"</strong> after the verb.</p>
        <div class="bg-teal-50 p-4 rounded-xl border border-teal-200 my-4">
          <p><strong>Example:</strong> The students solved the <em>grammar quiz</em>.</p>
          <p class="text-sm text-teal-700">Ask: "The students solved WHAT?" ➔ Answer: "the grammar quiz" (Object).</p>
        </div>

        <h3>3. Key Rule to Remember</h3>
        <p>Not all verbs require an object! Verbs that need an object are <strong>Transitive</strong>, while verbs that do not are <strong>Intransitive</strong> (e.g. "The baby laughed").</p>
      `,
      assets: {
        create: [
          {
            title: 'Subject & Object Identification Worksheet (PDF)',
            assetType: 'WORKSHEET',
            fileUrl: '/worksheets/subject-object-worksheet.pdf',
            fileSize: 245000,
            isDownloadable: true
          }
        ]
      }
    }
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Direct and Indirect Objects: The Ultimate Guide',
      slug: 'direct-and-indirect-objects',
      summary: 'Never confuse Direct and Indirect Objects again. Learn the two-question test to identify both in seconds.',
      gradeLevel: 'Class 7 - 10',
      difficulty: Difficulty.INTERMEDIATE,
      subjectId: englishSubject.id,
      topicId: topicSentence.id,
      teacherId: teacherRiffat.id,
      durationMinutes: 25,
      isPublished: true,
      publishedAt: new Date(),
      videoProvider: VideoProvider.YOUTUBE,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/images/logo.png',
      content: `
        <h2>Direct vs. Indirect Objects</h2>
        <p>Some sentences have <strong>two</strong> objects! Understanding the difference unlocks correct sentence construction.</p>
        
        <h3>The Formula:</h3>
        <ul>
          <li><strong>Direct Object (DO):</strong> Answers <em>"What?"</em> or <em>"Whom?"</em> after the verb.</li>
          <li><strong>Indirect Object (IO):</strong> Answers <em>"To whom?"</em> or <em>"For whom?"</em> the action is done.</li>
        </ul>

        <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200 my-4">
          <p><strong>Example:</strong> Riffat gave <em>the students</em> a <em>notebook</em>.</p>
          <p class="text-sm text-emerald-800">
            • Verb: gave<br/>
            • Gave WHAT? ➔ a notebook (Direct Object)<br/>
            • To WHOM? ➔ the students (Indirect Object)
          </p>
        </div>
      `
    }
  });

  const lesson3 = await prisma.lesson.create({
    data: {
      title: 'Articles Made Simple: A, An, and The',
      slug: 'articles-made-simple-a-an-the',
      summary: 'A complete practical guide to indefinite articles (A/An based on sound, not spelling) and the definite article (The).',
      gradeLevel: 'Class 6 - 8',
      difficulty: Difficulty.BEGINNER,
      subjectId: englishSubject.id,
      topicId: topicArticles.id,
      teacherId: teacherRiffat.id,
      durationMinutes: 18,
      isPublished: true,
      publishedAt: new Date(),
      videoProvider: VideoProvider.YOUTUBE,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/images/logo.png',
      content: `
        <h2>The Secret of Articles</h2>
        <p>In English, articles are determiners that specify whether a noun is general or specific.</p>
        
        <h3>Rule 1: Sound Matters, Not Just Letters!</h3>
        <p>We use <strong>'An'</strong> before a <em>vowel sound</em>, and <strong>'A'</strong> before a <em>consonant sound</em>.</p>
        <ul>
          <li><strong>An honest person</strong> (Starts with vowel sound /ɒ/)</li>
          <li><strong>A university</strong> (Starts with consonant sound /j/)</li>
          <li><strong>An hour</strong> (Silent 'h')</li>
        </ul>
      `
    }
  });

  const lesson4 = await prisma.lesson.create({
    data: {
      title: 'WH Questions vs. Yes/No Questions in Action',
      slug: 'wh-questions-vs-yes-no-questions',
      summary: 'Master auxiliary verb inversion and question words to form accurate, confident questions in English.',
      gradeLevel: 'Class 6 - 9',
      difficulty: Difficulty.INTERMEDIATE,
      subjectId: englishSubject.id,
      topicId: topicQuestions.id,
      teacherId: teacherTanvir.id,
      durationMinutes: 22,
      isPublished: true,
      publishedAt: new Date(),
      videoProvider: VideoProvider.YOUTUBE,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: '/images/logo.png',
      content: `
        <h2>Mastering English Questions</h2>
        <p>Questions in English fall into two major categories: Closed (Yes/No) and Open (WH-Questions).</p>
      `
    }
  });

  // Track lesson progress for Abrar
  await prisma.lessonProgress.create({
    data: {
      userId: studentAbrar.id,
      lessonId: lesson1.id,
      isCompleted: true,
      completedAt: new Date(),
      lastPositionSeconds: 1200
    }
  });

  // 5. Structured Course
  console.log('Creating course & curriculum...');
  const foundationCourse = await prisma.course.create({
    data: {
      title: 'Mastering English Sentences & Daily Grammar',
      slug: 'mastering-english-sentences',
      description: 'The signature foundation course by Riffat Sultana. Master sentence building, direct and indirect objects, question forms, and grammatical accuracy for exams and communication.',
      gradeRange: 'Class 6 - Class 10',
      difficulty: Difficulty.BEGINNER,
      subjectId: englishSubject.id,
      instructorId: teacherRiffat.id,
      thumbnailUrl: '/images/logo.png',
      isPublished: true,
      enrollmentType: 'PUBLIC',
      certificateEnabled: true,
      modules: {
        create: [
          {
            title: 'Module 1: The Core Structure of English Sentences',
            orderIndex: 1,
            lessons: {
              create: [
                { lessonId: lesson1.id, orderIndex: 1, isMandatory: true },
                { lessonId: lesson2.id, orderIndex: 2, isMandatory: true }
              ]
            }
          },
          {
            title: 'Module 2: Determiners & Articles',
            orderIndex: 2,
            lessons: {
              create: [
                { lessonId: lesson3.id, orderIndex: 1, isMandatory: true }
              ]
            }
          },
          {
            title: 'Module 3: Forming Accurate Questions',
            orderIndex: 3,
            lessons: {
              create: [
                { lessonId: lesson4.id, orderIndex: 1, isMandatory: true }
              ]
            }
          }
        ]
      },
      certificateTemplate: {
        create: {
          title: 'Certificate of Course Completion',
          signatoryName: 'Riffat Sultana',
          signatoryTitle: 'Founder & Lead English Instructor, Riffat\'s Classroom'
        }
      }
    }
  });

  // Enroll Abrar in the course
  await prisma.courseEnrollment.create({
    data: {
      courseId: foundationCourse.id,
      userId: studentAbrar.id,
      status: 'COMPLETED'
    }
  });

  const certTemplate = await prisma.certificateTemplate.findFirst({
    where: { courseId: foundationCourse.id }
  });

  await prisma.certificate.create({
    data: {
      certificateNumber: 'RC-2026-0001',
      verificationCode: 'RC-2026-EN-001',
      userId: studentAbrar.id,
      courseId: foundationCourse.id,
      templateId: certTemplate?.id,
      studentName: 'Abrar Zahin',
      courseTitle: 'Mastering English Sentences & Grammar Foundations',
      issuedAt: new Date('2026-10-15T10:00:00Z'),
    }
  });

  // 6. Central Question Bank
  console.log('Populating Question Bank...');
  
  // Q1: Single MCQ (Subject Identification)
  const q1 = await prisma.question.create({
    data: {
      authorId: teacherRiffat.id,
      subjectId: englishSubject.id,
      topicId: topicSentence.id,
      gradeLevel: 'Class 7',
      difficulty: Difficulty.BEGINNER,
      type: QuestionType.SINGLE_MCQ,
      questionText: 'Identify the Subject in the following sentence: "Early in the morning, the diligent teacher prepares her lessons."',
      explanation: '"The diligent teacher" is the subject because she is the one performing the action of preparing.',
      points: 1.0,
      tags: ['subject', 'sentence-structure'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'Early in the morning', isCorrect: false, orderIndex: 1 },
          { optionKey: 'B', optionText: 'The diligent teacher', isCorrect: true, orderIndex: 2 },
          { optionKey: 'C', optionText: 'Prepares', isCorrect: false, orderIndex: 3 },
          { optionKey: 'D', optionText: 'Her lessons', isCorrect: false, orderIndex: 4 }
        ]
      }
    }
  });

  // Q2: Single MCQ (Direct Object)
  const q2 = await prisma.question.create({
    data: {
      authorId: teacherRiffat.id,
      subjectId: englishSubject.id,
      topicId: topicSentence.id,
      gradeLevel: 'Class 8',
      difficulty: Difficulty.INTERMEDIATE,
      type: QuestionType.SINGLE_MCQ,
      questionText: 'In the sentence "Riffat taught the enthusiastic students an inspiring grammar lesson," which phrase is the DIRECT OBJECT?',
      explanation: 'Ask: "Taught WHAT?" ➔ "An inspiring grammar lesson" is what was taught (Direct Object). "The enthusiastic students" is the Indirect Object (to whom it was taught).',
      points: 1.0,
      tags: ['direct-object', 'grammar'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'Riffat', isCorrect: false, orderIndex: 1 },
          { optionKey: 'B', optionText: 'The enthusiastic students', isCorrect: false, orderIndex: 2 },
          { optionKey: 'C', optionText: 'An inspiring grammar lesson', isCorrect: true, orderIndex: 3 },
          { optionKey: 'D', optionText: 'Taught', isCorrect: false, orderIndex: 4 }
        ]
      }
    }
  });

  // Q3: Fill in the Blank (Articles)
  const q3 = await prisma.question.create({
    data: {
      authorId: teacherRiffat.id,
      subjectId: englishSubject.id,
      topicId: topicArticles.id,
      gradeLevel: 'Class 7',
      difficulty: Difficulty.BEGINNER,
      type: QuestionType.FILL_BLANK,
      questionText: 'She has been waiting at the bus station for _____ hour.',
      explanation: '"Hour" begins with a silent \'h\', creating a vowel sound /aʊə/, so the indefinite article "an" is required.',
      points: 1.0,
      tags: ['articles', 'vowel-sound'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'an', isCorrect: true, orderIndex: 1 },
          { optionKey: 'B', optionText: 'a', isCorrect: false, orderIndex: 2 },
          { optionKey: 'C', optionText: 'the', isCorrect: false, orderIndex: 3 },
          { optionKey: 'D', optionText: 'no article', isCorrect: false, orderIndex: 4 }
        ]
      }
    }
  });

  // Q4: True/False (Articles)
  const q4 = await prisma.question.create({
    data: {
      authorId: teacherRiffat.id,
      subjectId: englishSubject.id,
      topicId: topicArticles.id,
      gradeLevel: 'Class 6',
      difficulty: Difficulty.BEGINNER,
      type: QuestionType.TRUE_FALSE,
      questionText: 'True or False: We should always write "a European country" instead of "an European country".',
      explanation: 'True! Although "European" begins with the letter \'E\', it produces the consonant sound /j/ (as in "you"), so "a" is correct.',
      points: 1.0,
      tags: ['articles', 'phonetics'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'True', isCorrect: true, orderIndex: 1 },
          { optionKey: 'B', optionText: 'False', isCorrect: false, orderIndex: 2 }
        ]
      }
    }
  });

  // Q5: Multiple MCQ (Question Formation)
  const q5 = await prisma.question.create({
    data: {
      authorId: teacherTanvir.id,
      subjectId: englishSubject.id,
      topicId: topicQuestions.id,
      gradeLevel: 'Class 8',
      difficulty: Difficulty.INTERMEDIATE,
      type: QuestionType.MULTIPLE_MCQ,
      questionText: 'Select ALL the grammatically correct interrogative sentences below (Multiple answers):',
      explanation: '"Where does she live?" and "Are you coming to school today?" follow correct English question structure with auxiliary inversion.',
      points: 2.0,
      tags: ['questions', 'syntax'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'Where does she live?', isCorrect: true, orderIndex: 1 },
          { optionKey: 'B', optionText: 'Where she lives?', isCorrect: false, orderIndex: 2 },
          { optionKey: 'C', optionText: 'Are you coming to school today?', isCorrect: true, orderIndex: 3 },
          { optionKey: 'D', optionText: 'Why you did say that?', isCorrect: false, orderIndex: 4 }
        ]
      }
    }
  });

  // Q6: Matching pairs question (Parts of speech)
  const q6 = await prisma.question.create({
    data: {
      authorId: teacherRiffat.id,
      subjectId: englishSubject.id,
      topicId: topicPartsOfSpeech.id,
      gradeLevel: 'Class 7',
      difficulty: Difficulty.BEGINNER,
      type: QuestionType.MATCHING,
      questionText: 'Match each highlighted word with its correct Part of Speech.',
      explanation: 'Quickly = Adverb, Honest = Adjective, Beautifully = Adverb, Dhaka = Proper Noun.',
      points: 2.0,
      tags: ['parts-of-speech', 'matching'],
      options: {
        create: [
          { optionKey: 'A', optionText: 'She walked *quickly* ➔ Adverb', isCorrect: true, orderIndex: 1 },
          { optionKey: 'B', optionText: 'He is an *honest* man ➔ Adjective', isCorrect: true, orderIndex: 2 },
          { optionKey: 'C', optionText: '*Dhaka* is a megacity ➔ Proper Noun', isCorrect: true, orderIndex: 3 }
        ]
      }
    }
  });

  // 7. Quizzes: Public Practice Quiz & Daily Challenge
  console.log('Creating Quizzes & Daily Challenges...');
  
  // Public Quiz 1: Mastering Sentences Quick Check
  const publicQuiz = await prisma.quiz.create({
    data: {
      title: 'Quick Check: Subject & Object Identification',
      slug: 'quick-check-subject-object',
      description: 'A 5-minute interactive check on finding subjects and direct/indirect objects. Try it as a guest or sign in to save your results!',
      subjectId: englishSubject.id,
      topicId: topicSentence.id,
      authorId: teacherRiffat.id,
      accessMode: QuizAccessMode.PUBLIC_GUEST,
      resultVisibility: ResultVisibility.IMMEDIATE,
      durationMinutes: 10,
      passingScorePercent: 60.0,
      isPublished: true,
      questions: {
        create: [
          { questionId: q1.id, points: 1.0, orderIndex: 1 },
          { questionId: q2.id, points: 1.0, orderIndex: 2 },
          { questionId: q3.id, points: 1.0, orderIndex: 3 }
        ]
      }
    }
  });

  // Daily Challenge Schedules (Weekly Plan)
  const days = [
    { day: 0, name: 'Mixed Grammar Practice', topicId: topicPartsOfSpeech.id },
    { day: 1, name: 'Parts of Speech & Verbs', topicId: topicPartsOfSpeech.id },
    { day: 2, name: 'Articles (A, An, The)', topicId: topicArticles.id },
    { day: 3, name: 'WH & Yes/No Questions', topicId: topicQuestions.id },
    { day: 4, name: 'Sentence Structure & Objects', topicId: topicSentence.id },
    { day: 5, name: 'Transformations & Agreement', topicId: topicSentence.id },
    { day: 6, name: 'Vocabulary & Grammar Fun', topicId: topicPartsOfSpeech.id }
  ];

  for (const item of days) {
    await prisma.dailyChallengeSchedule.upsert({
      where: {
        dayOfWeek_topicId: {
          dayOfWeek: item.day,
          topicId: item.topicId
        }
      },
      update: {},
      create: {
        dayOfWeek: item.day,
        topicId: item.topicId,
        difficulty: Difficulty.BEGINNER,
        questionCount: 5
      }
    });
  }

  // Create today's Daily Challenge Quiz instance
  const today = new Date();
  const todayDayOfWeek = today.getDay();
  const scheduleForToday = await prisma.dailyChallengeSchedule.findFirst({
    where: { dayOfWeek: todayDayOfWeek }
  });

  if (scheduleForToday) {
    const dailyQuiz = await prisma.quiz.create({
      data: {
        title: `Daily Grammar Challenge — ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'Asia/Dhaka' })}`,
        slug: `daily-challenge-${today.toISOString().split('T')[0]}`,
        description: 'Today\'s 5-minute English grammar brain workout. Keep your learning streak alive!',
        subjectId: englishSubject.id,
        topicId: scheduleForToday.topicId,
        authorId: teacherRiffat.id,
        accessMode: QuizAccessMode.PUBLIC_GUEST,
        resultVisibility: ResultVisibility.IMMEDIATE,
        durationMinutes: 10,
        passingScorePercent: 60.0,
        isPublished: true,
        isDailyChallenge: true,
        questions: {
          create: [
            { questionId: q1.id, points: 1.0, orderIndex: 1 },
            { questionId: q2.id, points: 1.0, orderIndex: 2 },
            { questionId: q3.id, points: 1.0, orderIndex: 3 },
            { questionId: q4.id, points: 1.0, orderIndex: 4 },
            { questionId: q5.id, points: 2.0, orderIndex: 5 }
          ]
        }
      }
    });

    await prisma.dailyChallengeInstance.create({
      data: {
        scheduleId: scheduleForToday.id,
        challengeDate: today,
        gradeLevel: 'All Levels',
        quizId: dailyQuiz.id
      }
    });
  }

  // 8. Community Forums
  console.log('Creating community forums...');
  const catGrammar = await prisma.forumCategory.create({
    data: {
      name: 'Grammar Help & Clarifications',
      slug: 'grammar-help',
      description: 'Ask any grammar question you encounter in school textbooks, homework, or daily reading.',
      icon: 'HelpCircle',
      orderIndex: 1
    }
  });

  const catTips = await prisma.forumCategory.create({
    data: {
      name: 'Study Tips & Exam Advice',
      slug: 'study-tips',
      description: 'Techniques for scoring higher in English examinations and retaining vocabulary.',
      icon: 'Lightbulb',
      orderIndex: 2
    }
  });

  const sampleThread = await prisma.forumThread.create({
    data: {
      categoryId: catGrammar.id,
      authorId: studentAbrar.id,
      title: 'How do I know whether a verb is Transitive or Intransitive easily?',
      slug: 'transitive-vs-intransitive-verbs-tip',
      content: 'I sometimes get confused when reading sentences like "The bird flies high" vs "He flies a kite". Is there an easy trick to remember?',
      posts: {
        create: [
          {
            authorId: teacherRiffat.id,
            content: 'Great question, Abrar! Always ask "WHAT?" or "WHOM?" after the verb. In "He flies a kite" ➔ Flies WHAT? A kite (Transitive). In "The bird flies high" ➔ "High" tells you HOW it flies (adverb), not WHAT it flies, so here "flies" is Intransitive!'
          }
        ]
      }
    }
  });

  // 9. Notices & Site Settings
  console.log('Creating notices and site settings...');
  await prisma.notice.create({
    data: {
      title: 'Welcome to Riffat\'s Classroom Online Learning Platform!',
      content: 'We are thrilled to welcome all students from Demra, Dhaka, across Bangladesh, and beyond! Explore our free grammar lessons, join the daily challenges, and build real confidence in English.',
      priority: 'NORMAL',
      audience: 'ALL',
      isPinned: true
    }
  });

  await prisma.siteSetting.createMany({
    data: [
      {
        key: 'site_name',
        value: JSON.stringify('Riffat\'s Classroom'),
        description: 'Brand platform title'
      },
      {
        key: 'tagline',
        value: JSON.stringify('Learn English. Build Confidence. Shine Brighter.'),
        description: 'Main motto'
      },
      {
        key: 'contact_email',
        value: JSON.stringify('contact@riffatsclassroom.com'),
        description: 'Support email'
      },
      {
        key: 'youtube_url',
        value: JSON.stringify('https://www.youtube.com/@riffats.classroom/videos'),
        description: 'Official YouTube channel'
      },
      {
        key: 'linkedin_url',
        value: JSON.stringify('https://www.linkedin.com/posts/riffat-s-classroom_mastering-sentences-full-slide-activity-7241377935792689152-io-o'),
        description: 'Educational LinkedIn channel'
      }
    ]
  });

  console.log('✅ Riffat\'s Classroom database seeded successfully with confirmed educational materials!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

