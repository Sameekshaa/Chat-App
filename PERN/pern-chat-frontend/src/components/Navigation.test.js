import React from "react";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fireEvent, screen } from "@testing-library/react";
import Navigation from "./Navigation";
import { renderWithProviders } from "../../utils/testUtils";
import { BrowserRouter } from "react-router-dom";
import '@testing-library/jest-dom'

const API_BASE_URL = "http://localhost:5001";

export const handlers = [
    rest.post(`${API_BASE_URL}/logout`, (req, res, ctx) => {
        return res(ctx.json(1))
    }),
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

test("logout button logs out user", async () => {
    renderWithProviders(
        <BrowserRouter>
            <Navigation />
        </BrowserRouter>,
        {
            preloadedState: {
                user: { name: "Test User", picture: "test.jpg" }
            }
        }
    );

    // should show user's name initially, and no Login link
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();

    // should logout the user after some api call
    fireEvent.click(screen.getByText('Test User'));
    fireEvent.click(screen.getByText(/logout/i));
    expect(await screen.findByText(/Login/i)).toBeInTheDocument();

});