
import { prisma } from './lib/prisma';

async function main() {
  try {
    console.log('Attempting to create topic...');
    
    // 1. Create subject
    const subject = await prisma.subject.create({
        data: {
            name: "Debug Subject " + Date.now(),
            slug: "debug-subject-" + Date.now(),
            icon: "🐛",
            color: "blue-500"
        }
    });
    console.log('Subject created:', subject.id);

    // 2. Create topic
    const topic = await prisma.topic.create({
      data: {
        name: 'Debug Topic ' + Date.now(),
        slug: 'debug-topic-' + Date.now(),
        subjectId: subject.id,
        icon: '📝',
        color: 'red-500', 
      },
    })
    console.log('Topic created successfully:', topic)
    
    // Cleanup
    await prisma.subject.delete({ where: { id: subject.id } });
    
  } catch (e) {
    console.error('Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
