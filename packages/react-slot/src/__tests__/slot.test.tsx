import { cleanup, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { Slot, Slottable } from "../index.js";

afterEach(() => {
  cleanup();
});

test("A.1: Delegación de Renderizado - renderiza el hijo directamente", () => {
  render(
    <Slot id="target">
      <a href="https://google.com">Link</a>
    </Slot>,
  );

  const link = screen.getByRole("link");
  expect(link).toBeDefined();
  expect(link.getAttribute("href")).toBe("https://google.com");
  expect(link.getAttribute("id")).toBe("target");
  expect(link.tagName).toBe("A");
});

test("A.2: Manejo de Elementos Nulos", () => {
  const { container } = render(<Slot />);
  expect(container.firstChild).toBeNull();
});

test("B.1: Mezcla de Clases CSS (className)", () => {
  render(
    <Slot className="slot-class-a slot-class-b">
      <div className="child-class-a child-class-b">Content</div>
    </Slot>,
  );

  const element = screen.getByText("Content");
  expect(element.getAttribute("class")).toBe(
    "slot-class-a slot-class-b child-class-a child-class-b",
  );
});

test("B.2: Mezcla de Estilos Inline (style) con prioridad para el hijo", () => {
  render(
    <Slot style={{ color: "red", marginTop: "10px" }}>
      <div style={{ color: "blue", padding: "5px" }}>Styled</div>
    </Slot>,
  );

  const element = screen.getByText("Styled");
  expect(element.style.color).toBe("blue");
  expect(element.style.marginTop).toBe("10px");
  expect(element.style.padding).toBe("5px");
});

test("C.1: Composición y Orden de Ejecución de Eventos", () => {
  const order: string[] = [];
  const slotHandler = vi.fn(() => order.push("slot"));
  const childHandler = vi.fn(() => order.push("child"));

  render(
    <Slot onClick={slotHandler}>
      <button onClick={childHandler}>Click me</button>
    </Slot>,
  );

  const button = screen.getByRole("button");
  button.click();

  expect(slotHandler).toHaveBeenCalled();
  expect(childHandler).toHaveBeenCalled();
  expect(order).toEqual(["child", "slot"]);
});

test("C.2: Gestión de Evento Único (Solo Slot)", () => {
  const slotHandler = vi.fn();
  render(
    <Slot onClick={slotHandler}>
      <button>Click me</button>
    </Slot>,
  );

  const button = screen.getByRole("button");
  button.click();
  expect(slotHandler).toHaveBeenCalled();
});

test("C.3: Gestión de Evento Único (Solo Hijo)", () => {
  const childHandler = vi.fn();
  render(
    <Slot>
      <button onClick={childHandler}>Click me</button>
    </Slot>,
  );

  const button = screen.getByRole("button");
  button.click();
  expect(childHandler).toHaveBeenCalled();
});

test("D.1: Referencias Tipo Callback Múltiples", () => {
  const slotRefCallback = vi.fn();
  const childRefCallback = vi.fn();

  render(
    <Slot ref={slotRefCallback}>
      <button ref={childRefCallback}>Button</button>
    </Slot>,
  );

  const button = screen.getByRole("button");
  expect(slotRefCallback).toHaveBeenCalledWith(button);
  expect(childRefCallback).toHaveBeenCalledWith(button);
});

test("D.2: Referencias Tipo Objeto (RefObject)", () => {
  const slotRef = createRef<HTMLButtonElement>();
  const childRef = createRef<HTMLButtonElement>();

  render(
    <Slot ref={slotRef}>
      <button ref={childRef}>Button</button>
    </Slot>,
  );

  const button = screen.getByRole("button");
  expect(slotRef.current).toBe(button);
  expect(childRef.current).toBe(button);
});

test("E.1: Soporte y Comportamiento con Slottable", () => {
  render(
    <Slot id="layout-props">
      <span>Icon</span>
      <Slottable>
        <button>Main Button</button>
      </Slottable>
    </Slot>,
  );

  const button = screen.getByRole("button");
  const span = screen.getByText("Icon");

  expect(button.getAttribute("id")).toBe("layout-props");
  expect(span).toBeDefined();
  expect(span.parentElement).toBe(button);
});

test("F.1: Múltiples Hijos sin Slottable lanza error controlado", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(
      <Slot>
        <div>A</div>
        <div>B</div>
      </Slot>,
    );
  }).toThrow();

  errorSpy.mockRestore();
});

test("F.2: Hijos Primitivos (Texto)", () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  expect(() => {
    render(<Slot>Just Text</Slot>);
  }).toThrow();

  errorSpy.mockRestore();
});
