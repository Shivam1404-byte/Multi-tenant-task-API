const request = require('supertest')
const app = require('../src/server')
const prisma = require('../src/db/prisma')

console.log("DB:", process.env.DATABASE_URL);

describe("POST /auth/register", ()=>{
    it("create a user",async ()=>{
        const res = await request(app)
            .post("/auth/register")
            .send({
                email: "test@example.com",
                password: "password@123",
                orgName: "Acme Inc"
            });
        
        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe("test@example.com");

        const user = await prisma.user.findUnique({
            where:{email: "test@example.com"}
        });

        expect(user).not.toBeNull();
    })
})