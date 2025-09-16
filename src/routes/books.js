export default async function booksRoutes(app) {
    
  // Schema simples de validação (JSON Schema)
  const bookBodySchema = {
    type: "object",
    required: ["title", "author"],
    properties: {
      title: { type: "string", minLength: 1 },
      author: { type: "string", minLength: 1 },
    },
  };

  const idParamSchema = {
    type: "object",
    required: ["id"],
    properties: {
      // Mantemos como string e convertemos manualmente
      id: { type: "string", pattern: "^[0-9]+$" },
    },
  };

  // Create
  app.post(
    "/books",
    { schema: { body: bookBodySchema } },
    async (req, reply) => {
      const { title, author } = req.body;
      const book = await app.prisma.book.create({ data: { title, author } });
      return reply.code(201).send(book);
    }
  );

  // Read (lista)
  app.get("/books", async (req, reply) => {
    const books = await app.prisma.book.findMany({
      orderBy: { id: "asc" },
    });
    return reply.send(books);
  });

  // Read (lista por id)
  app.get(
    "/books/:id",
    { schema: { params: idParamSchema } },
    async (req, reply) => {
      const id = parseInt(req.params.id, 10);
      const book = await app.prisma.book.findUnique({ where: { id } });
      if (!book) return reply.code(404).send({ message: "Não encontrado" });
      return reply.send(book);
    }
  );

  // Update
  app.put(
    "/books/:id",
    { schema: { params: idParamSchema, body: bookBodySchema } },
    async (req, reply) => {
      const id = parseInt(req.params.id, 10);
      const exists = await app.prisma.book.findUnique({ where: { id } });
      if (!exists) return reply.code(404).send({ message: "Não encontrado" });

      const { title, author } = req.body;
      const updated = await app.prisma.book.update({
        where: { id },
        data: { title, author },
      });
      return reply.send(updated);
    }
  );

  // Delete
  app.delete(
    "/books/:id",
    { schema: { params: idParamSchema } },
    async (req, reply) => {
      const id = parseInt(req.params.id, 10);
      const exists = await app.prisma.book.findUnique({ where: { id } });
      if (!exists) return reply.code(404).send({ message: "Não encontrado" });

      await app.prisma.book.delete({ where: { id } });
      return reply.code(204).send();
    }
  );
}
