import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
});

interface SubjectData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  topics: {
    name: string;
    slug: string;
    description: string;
  }[];
}

const subjects: SubjectData[] = [
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Explore algebra, calculus, geometry, and more",
    icon: "📐",
    topics: [
      {
        name: "Algebra",
        slug: "algebra",
        description: "Linear equations, polynomials, and functions",
      },
      {
        name: "Calculus",
        slug: "calculus",
        description: "Limits, derivatives, and integrals",
      },
      {
        name: "Geometry",
        slug: "geometry",
        description: "Shapes, areas, and volumes",
      },
      {
        name: "Statistics",
        slug: "statistics",
        description: "Data analysis and probability",
      },
    ],
  },
  {
    name: "Physics",
    slug: "physics",
    description: "Mechanics, thermodynamics, electricity, and waves",
    icon: "⚛️",
    topics: [
      {
        name: "Mechanics",
        slug: "mechanics",
        description: "Motion, forces, and energy",
      },
      {
        name: "Thermodynamics",
        slug: "thermodynamics",
        description: "Heat, temperature, and entropy",
      },
      {
        name: "Electromagnetism",
        slug: "electromagnetism",
        description: "Electric and magnetic fields",
      },
      {
        name: "Waves & Optics",
        slug: "waves-optics",
        description: "Sound, light, and wave phenomena",
      },
    ],
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    description: "Organic, inorganic, and physical chemistry",
    icon: "🧪",
    topics: [
      {
        name: "Organic Chemistry",
        slug: "organic-chemistry",
        description: "Carbon compounds and reactions",
      },
      {
        name: "Inorganic Chemistry",
        slug: "inorganic-chemistry",
        description: "Metals, minerals, and compounds",
      },
      {
        name: "Physical Chemistry",
        slug: "physical-chemistry",
        description: "Energy changes and kinetics",
      },
    ],
  },
  {
    name: "Biology",
    slug: "biology",
    description: "Cell biology, genetics, ecology, and human anatomy",
    icon: "🧬",
    topics: [
      {
        name: "Cell Biology",
        slug: "cell-biology",
        description: "Cell structure and function",
      },
      {
        name: "Genetics",
        slug: "genetics",
        description: "DNA, inheritance, and evolution",
      },
      {
        name: "Human Anatomy",
        slug: "human-anatomy",
        description: "Body systems and organs",
      },
      {
        name: "Ecology",
        slug: "ecology",
        description: "Ecosystems and environmental science",
      },
    ],
  },
  {
    name: "Computer Science",
    slug: "computer-science",
    description: "Programming, algorithms, data structures, and more",
    icon: "💻",
    topics: [
      {
        name: "Programming Basics",
        slug: "programming-basics",
        description: "Introduction to coding concepts",
      },
      {
        name: "Data Structures",
        slug: "data-structures",
        description: "Arrays, lists, trees, and graphs",
      },
      {
        name: "Algorithms",
        slug: "algorithms",
        description: "Sorting, searching, and optimization",
      },
      {
        name: "Web Development",
        slug: "web-development",
        description: "HTML, CSS, JavaScript, and frameworks",
      },
    ],
  },
  {
    name: "English",
    slug: "english",
    description: "Grammar, literature, and writing skills",
    icon: "📚",
    topics: [
      {
        name: "Grammar",
        slug: "grammar",
        description: "Parts of speech, sentence structure",
      },
      {
        name: "Literature",
        slug: "literature",
        description: "Classic and modern works analysis",
      },
      {
        name: "Essay Writing",
        slug: "essay-writing",
        description: "Academic and creative writing",
      },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");
  console.log("");

  for (const subjectData of subjects) {
    console.log(`📚 Creating subject: ${subjectData.name}`);

    const subject = await prisma.subject.upsert({
      where: { slug: subjectData.slug },
      update: {
        name: subjectData.name,
        description: subjectData.description,
        icon: subjectData.icon,
      },
      create: {
        name: subjectData.name,
        slug: subjectData.slug,
        description: subjectData.description,
        icon: subjectData.icon,
      },
    });

    for (const topicData of subjectData.topics) {
      console.log(`   📑 Creating topic: ${topicData.name}`);

      await prisma.topic.upsert({
        where: { slug: topicData.slug },
        update: {
          name: topicData.name,
          description: topicData.description,
          subjectId: subject.id,
        },
        create: {
          name: topicData.name,
          slug: topicData.slug,
          description: topicData.description,
          subjectId: subject.id,
        },
      });
    }
    console.log("");
  }

  console.log("✅ Seeding completed!");
  console.log("");

  // Show stats
  const subjectCount = await prisma.subject.count();
  const topicCount = await prisma.topic.count();
  const documentCount = await prisma.document.count();

  console.log("📊 Database stats:");
  console.log(`   Subjects: ${subjectCount}`);
  console.log(`   Topics: ${topicCount}`);
  console.log(`   Documents: ${documentCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
