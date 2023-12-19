import * as bookService from "./bookService.js"
import { Eta } from "https://deno.land/x/eta@v3.1.0/src/index.ts";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` })

const showForm = async (c) => {
    const data = {
        books: await bookService.listBooks()
    }

    return c.html(eta.render("books.eta", data))
}

const addBook = async(c) => {
    const body = await c.req.parseBody()
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