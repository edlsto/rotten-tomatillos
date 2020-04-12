import React from "react";
import { Header } from "./Header";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "../../reducers";

describe("header", () => {
  it("should render the text we expect", () => {
    const store = createStore(rootReducer);
    const { getByText } = render(
      <Header
        user={{
          name: "Ed",
          id: 2,
          email: "ed@ed.com",
        }}
      />
    );
    const title = getByText("Rancid Tomatillos");
    const signOut = getByText("Sign Out");
    const greeting = getByText("Hello, Ed");
    expect(title).toBeInTheDocument();
    expect(signOut).toBeInTheDocument();
    expect(greeting).toBeInTheDocument();
  });

  it("should fire correct function when log out button clicked", () => {
    const store = createStore(rootReducer);
    const mockLogOut = jest.fn();
    const mockClearRatings = jest.fn();
    const { getByText } = render(
      <Header
        user={{
          name: "Ed",
          id: 2,
          email: "ed@ed.com",
        }}
        logout={mockLogOut}
        clearRatings={mockClearRatings}
      />
    );
    const signOut = getByText("Sign Out");
    fireEvent.click(signOut);
    expect(mockLogOut).toBeCalledTimes(1);
  });

  it("should fire correct function when log in button clicked", () => {
    const store = createStore(rootReducer);
    const mockShowModal = jest.fn();
    const { getByText } = render(
      <Header
        user={{
          name: "",
          id: null,
          email: "",
        }}
        showModal={mockShowModal}
      />
    );
    const signIn = getByText("Sign In");
    fireEvent.click(signIn);
    expect(mockShowModal).toBeCalledTimes(1);
  });
});
