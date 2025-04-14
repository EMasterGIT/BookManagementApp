const { Book, Author, Category } = require('../src/models');
const axios = require('axios');
const sequelize = require('../config/config.json'); // Loeme ühenduse 'sequelize'

const importBooks = async () => {
  const categories = ["fiction", "fantasy", "history", "romance", "mystery"];
  try {
    for (const subject of categories) {
      const [category] = await Category.findOrCreate({
        where: { name: subject },
      });

      const res = await axios.get(
        `https://openlibrary.org/subjects/${subject}.json?limit=5`
      );

      if (res.data.works) {
        const works = res.data.works;
        for (const work of works) {
          const [book] = await Book.findOrCreate({
            where: {
              title: work.title,
              publicationYear: work.first_publish_year || null,
            },
            defaults: {
              categoryId: category.id,
            },
          });

          if (work.authors) {
            for (const authorData of work.authors) {
              const nameParts = authorData.name.trim().split(" ");
              const lastName = nameParts.pop();
              const firstName = nameParts.join(" ");

              const [author] = await Author.findOrCreate({
                where: {
                  firstName,
                  lastName,
                },
              });

              await book.addAuthor(author);
            }
          }
        }
      }
    }
    console.log("Raamatud imporditud!");
  } catch (error) {
    console.error("Viga raamatute importimisel:", error.message);
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await importBooks();
  },
  down: async (queryInterface, Sequelize) => {
    await Book.destroy({ where: {}, truncate: true });
    await Author.destroy({ where: {}, truncate: true });
    await Category.destroy({ where: {}, truncate: true });
    console.log("Kõik imporditud andmed eemaldatud.");
  },
};
