import * as bookService from "./bookService.js"
import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` })

const validator = z.object({
    name: z.string().min(3, { message: "The book name should be a string of at least 3 characters." }),
    pages: z.coerce.number()
            .min(1, { message: "The number of pages should be a number between 1 and 1000." })
            .max(1000, { message: "The number of pages should be a number between 1 and 1000."}),
    isbn: z.string().length(13, { message: "The ISBN should be a string of 13 characters." })
})

const showForm = async (c) => {
    const data = {
        books: await bookService.listBooks()
    }

    return c.html(eta.render("books.eta", data))
}

const addBook = async(c) => {
    const body = await c.req.parseBody()
    const validationResult = validator.safeParse(body)
    if(!validationResult.success){
        return c.html(eta.render("books.eta", {
            ...body,
            errors: validationResult.error.format(),
            books: await bookService.listBooks(),
        }))
    } 
        await bookService.addBook(body)
        return c.redirect("/books")
    
    
}

const showBook = async(c) => {
    const id = c.req.param("id")
    const data = {
        book: await bookService.listBook(id)
    }

    return c.html(eta.render("book.eta", data))
}

const updateBook = async(c) => {
    const id = c.req.param("id")
    const body = await c.req.parseBody()

    await bookService.updateBook(id, body)

    return c.redirect(`/books/${id}`)
}

const deleteBook = async(c) => {
    const id = c.req.param("id")

    await bookService.deleteBook(id)

    return c.redirect(`/books`)
}

export { showForm, addBook, showBook, updateBook, deleteBook }