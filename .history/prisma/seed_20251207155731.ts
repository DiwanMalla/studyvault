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
    name: "Medicine",
    slug: "medicine",
    description: "Internal medicine, clinical diagnosis, and systemic diseases",
    icon: "🩺",
    topics: [
      {
        name: "Cardiology",
        slug: "cardiology",
        description: "Heart diseases, ECG, and cardiac conditions",
      },
      {
        name: "Pulmonology",
        slug: "pulmonology",
        description: "Respiratory diseases and lung conditions",
      },
      {
        name: "Gastroenterology",
        slug: "gastroenterology",
        description: "GI tract diseases and liver conditions",
      },
      {
        name: "Nephrology",
        slug: "nephrology",
        description: "Kidney diseases and renal conditions",
      },
      {
        name: "Neurology",
        slug: "neurology",
        description: "Brain and nervous system disorders",
      },
      {
        name: "Endocrinology",
        slug: "endocrinology",
        description: "Hormonal disorders and diabetes",
      },
      {
        name: "Infectious Diseases",
        slug: "infectious-diseases",
        description: "Bacterial, viral, and parasitic infections",
      },
      {
        name: "Rheumatology",
        slug: "rheumatology",
        description: "Autoimmune and joint diseases",
      },
      {
        name: "Hematology",
        slug: "hematology",
        description: "Blood disorders and coagulation",
      },
    ],
  },
  {
    name: "Pediatrics",
    slug: "pediatrics",
    description: "Child health, growth, development, and pediatric diseases",
    icon: "👶",
    topics: [
      {
        name: "Neonatology",
        slug: "neonatology",
        description: "Newborn care and neonatal conditions",
      },
      {
        name: "Growth & Development",
        slug: "growth-development",
        description: "Child milestones and growth assessment",
      },
      {
        name: "Pediatric Nutrition",
        slug: "pediatric-nutrition",
        description: "Infant feeding and nutritional disorders",
      },
      {
        name: "Pediatric Infections",
        slug: "pediatric-infections",
        description: "Common childhood infections and immunization",
      },
      {
        name: "Pediatric Cardiology",
        slug: "pediatric-cardiology",
        description: "Congenital heart diseases",
      },
      {
        name: "Pediatric Neurology",
        slug: "pediatric-neurology",
        description: "Neurological disorders in children",
      },
      {
        name: "Pediatric Emergency",
        slug: "pediatric-emergency",
        description: "Emergency care in children",
      },
      {
        name: "Pediatric Respiratory",
        slug: "pediatric-respiratory",
        description: "Respiratory conditions in children",
      },
    ],
  },
  {
    name: "Obstetrics & Gynecology",
    slug: "gynae",
    description: "Pregnancy, childbirth, and female reproductive health",
    icon: "🤰",
    topics: [
      {
        name: "Antenatal Care",
        slug: "antenatal-care",
        description: "Pregnancy care and monitoring",
      },
      {
        name: "Labor & Delivery",
        slug: "labor-delivery",
        description: "Normal and complicated deliveries",
      },
      {
        name: "High Risk Pregnancy",
        slug: "high-risk-pregnancy",
        description: "Complications during pregnancy",
      },
      {
        name: "Postpartum Care",
        slug: "postpartum-care",
        description: "Care after delivery",
      },
      {
        name: "Gynecological Disorders",
        slug: "gynecological-disorders",
        description: "Menstrual disorders and infections",
      },
      {
        name: "Gynecological Oncology",
        slug: "gynecological-oncology",
        description: "Cancers of female reproductive system",
      },
      {
        name: "Infertility",
        slug: "infertility",
        description: "Causes and management of infertility",
      },
      {
        name: "Contraception",
        slug: "contraception",
        description: "Family planning methods",
      },
    ],
  },
  {
    name: "Surgery",
    slug: "surgery",
    description:
      "General surgery, surgical procedures, and operative techniques",
    icon: "🔪",
    topics: [
      {
        name: "General Surgery",
        slug: "general-surgery",
        description: "Abdominal surgery and hernias",
      },
      {
        name: "GI Surgery",
        slug: "gi-surgery",
        description: "Gastrointestinal surgical conditions",
      },
      {
        name: "Breast Surgery",
        slug: "breast-surgery",
        description: "Breast diseases and mastectomy",
      },
      {
        name: "Thyroid Surgery",
        slug: "thyroid-surgery",
        description: "Thyroid and parathyroid conditions",
      },
      {
        name: "Trauma Surgery",
        slug: "trauma-surgery",
        description: "Emergency and trauma management",
      },
      {
        name: "Vascular Surgery",
        slug: "vascular-surgery",
        description: "Blood vessel disorders",
      },
      {
        name: "Surgical Oncology",
        slug: "surgical-oncology",
        description: "Cancer surgeries",
      },
      {
        name: "Pre & Post Operative Care",
        slug: "operative-care",
        description: "Surgical patient management",
      },
      {
        name: "Urology",
        slug: "urology",
        description: "Urinary system and male reproductive disorders",
      },
    ],
  },
  {
    name: "Minors",
    slug: "minors",
    description:
      "Orthopedics, ENT, Ophthalmology, Dermatology, Psychiatry, and more",
    icon: "🏥",
    topics: [
      {
        name: "Orthopedics",
        slug: "orthopedics",
        description: "Bone and joint disorders, fractures",
      },
      {
        name: "ENT",
        slug: "ent",
        description: "Ear, nose, and throat conditions",
      },
      {
        name: "Ophthalmology",
        slug: "ophthalmology",
        description: "Eye diseases and vision disorders",
      },
      {
        name: "Dermatology",
        slug: "dermatology",
        description: "Skin diseases and conditions",
      },
      {
        name: "Psychiatry",
        slug: "psychiatry",
        description: "Mental health disorders",
      },
      {
        name: "Radiology",
        slug: "radiology",
        description: "Imaging and diagnostic radiology",
      },
      {
        name: "Anesthesia",
        slug: "anesthesia",
        description: "Anesthesia and pain management",
      },
      {
        name: "Community Medicine",
        slug: "community-medicine",
        description: "Public health and epidemiology",
      },
      {
        name: "Forensic Medicine",
        slug: "forensic-medicine",
        description: "Medicolegal aspects and toxicology",
      },
      {
        name: "Pathology",
        slug: "pathology",
        description: "Disease mechanisms and lab diagnosis",
      },
      {
        name: "Pharmacology",
        slug: "pharmacology",
        description: "Drug actions and therapeutics",
      },
      {
        name: "Microbiology",
        slug: "microbiology",
        description: "Bacteria, viruses, and parasites",
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
