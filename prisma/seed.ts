import { Leader, PrismaClient, Voter } from "@prisma/client";
import { fakerES as faker } from "@faker-js/faker";

const prisma = new PrismaClient();
function generateRandomNumber(): string {
  const part1 = Math.floor(Math.random() * 10); // generates a random number between 0 and 9
  const part2 = Math.floor(Math.random() * 1000); // generates a random number between 0 and 999
  const part3 = Math.floor(Math.random() * 1000000); // generates a random number between 0 and 999999

  return `${part1}-${part2.toString().padStart(3, "0")}-${part3.toString().padStart(6, "0")}`;
}

function findRandomLeader(leaders: Leader[]): Leader {
  return leaders[Math.floor(Math.random() * leaders.length)];
}

async function main() {
  const leaders: Leader[] = [];
  // Leaders
  await prisma.leader.create({
    data: {
      name: "noExist",
      lastName: "noExist",
      email: "noExist@noexist.com",
      nationalId: "noExist",
    },
  });
  for (let i = 0; i < 15; i++) {
    const leader = await prisma.leader.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        nationalId: generateRandomNumber(),
      },
    });
    leaders.push(leader);
  }

  const randVotersLength = Math.floor(Math.random() * 3500);
  console.log(`Creating ${randVotersLength} voters`);

  // Voters
  for (let i = 0; i < randVotersLength; i++) {
    await prisma.voter.create({
      data: {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        nationalId: generateRandomNumber(),
        desk: faker.number.int({ min: 12, max: 97 }).toString(),
        school: faker.company.name(),
        township: faker.location.city(),
        leader: {
          connect: {
            id: findRandomLeader(leaders).id,
          },
        },
      },
    });
  }
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
