import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Danh sách category mặc định
  const categories = [
    {
      name: 'Hóa đơn',
      icon: '💡',
      children: [
        { name: 'Tiền điện', icon: '⚡' },
        { name: 'Tiền gas', icon: '🔥' },
        { name: 'Tiền internet', icon: '🌐' },
        { name: 'Tiền điện thoại', icon: '📱' },
        { name: 'Tiền thuê nhà', icon: '🏠' },
        { name: 'Tiền truyền hình', icon: '📺' },
        { name: 'Tiền nước', icon: '💧' },
      ],
    },
    {
      name: 'Giáo dục',
      icon: '🎓',
      children: [],
    },
    {
      name: 'Giải trí',
      icon: '🎮',
      children: [
        { name: 'Vui chơi', icon: '🎉' },
        { name: 'Dịch vụ xem phim', icon: '📽️' },
      ],
    },
    {
      name: 'Gia đình',
      icon: '👨‍👩‍👧‍👦',
      children: [
        { name: 'Sửa chữa nhà cửa', icon: '🛠️' },
        { name: 'Dịch vụ gia đình', icon: '🧹' },
        { name: 'Thú cưng', icon: '🐶' },
      ],
    },
    {
      name: 'Ăn uống',
      icon: '🍔',
      children: [],
    },
    {
      name: 'Sức khỏe & Thể hình',
      icon: '💪',
      children: [
        { name: 'Tập luyện', icon: '🏋️' },
        { name: 'Khám sức khỏe', icon: '🩺' },
      ],
    },
    {
      name: 'Mua sắm',
      icon: '🛒',
      children: [
        { name: 'Đồ gia dụng', icon: '🏡' },
        { name: 'Mỹ phẩm', icon: '💄' },
        { name: 'Đồ cá nhân', icon: '🧴' },
      ],
    },
    {
      name: 'Di chuyển',
      icon: '🚗',
      children: [{ name: 'Bảo dưỡng xe', icon: '🔧' }],
    },
    {
      name: 'Đầu tư',
      icon: '📈',
      children: [],
    },
  ];

  const incomeCategories = [
    { name: 'Lương', icon: '💵' },
    { name: 'Thu lãi', icon: '🏦' },
    { name: 'Thu nhập khác', icon: '💰' },
  ];

  for (const category of incomeCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        type: 'INCOME',
        icon: category.icon,
      },
    });
  }

  // Vòng lặp tạo hoặc cập nhật category
  for (const category of categories) {
    // Upsert cha
    const parent = await prisma.category.upsert({
      where: { name: category.name }, // tìm theo name (unique)
      update: {}, // không cần update gì thêm
      create: {
        name: category.name,
        type: 'EXPENSE',
        icon: category.icon,
      },
    });

    // Upsert con
    for (const child of category.children) {
      await prisma.category.upsert({
        where: { name: child.name },
        update: {},
        create: {
          name: child.name,
          type: 'EXPENSE',
          icon: child.icon,
          parentId: parent.id, // liên kết với category cha
        },
      });
    }
  }

  console.log('✅ Seed dữ liệu category thành công!');
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
