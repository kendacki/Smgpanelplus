import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const FROM_NGN = 1550;

function toUsdt(amount: number) {
  return Number((amount / FROM_NGN).toFixed(6));
}

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.currency === "USDT") continue;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        currency: "USDT",
        balance: user.currency === "USD" ? user.balance : toUsdt(user.balance),
      },
    });
  }

  const services = await prisma.service.findMany({ select: { id: true, rate: true } });
  const looksLikeNgn = services.some((row) => row.rate > 15);
  if (looksLikeNgn) {
    for (const service of services) {
      await prisma.service.update({
        where: { id: service.id },
        data: { rate: toUsdt(service.rate) },
      });
    }
  }

  const payments = await prisma.payment.findMany();
  for (const payment of payments) {
    if (payment.currency === "USDT") continue;
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        currency: "USDT",
        amount: payment.currency === "USD" ? payment.amount : toUsdt(payment.amount),
      },
    });
  }

  if (looksLikeNgn) {
    const orders = await prisma.order.findMany({ select: { id: true, charge: true } });
    for (const order of orders) {
      await prisma.order.update({
        where: { id: order.id },
        data: { charge: toUsdt(order.charge) },
      });
    }
  }

  await prisma.faq.updateMany({
    where: { question: "What payment methods do you support?" },
    data: {
      answer:
        "USDT on TRC20. Demo credit is available for testing. Wallet, rates, and API balances are USDT only.",
    },
  });

  console.log("Migrated wallet, catalog, and payments to USDT.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
