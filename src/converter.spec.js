import { pdfzip, pdf, svgzip } from "./converter";

describe("pdfzip", () => {
  it("should return a blob", async () => {
    const svg = `<svg height="100" width="100">
                        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                    </svg>`;

    const result = await pdfzip(
      [
        { svg, name: "Johnny" },
        { svg, name: "Alfred" },
      ],
      {}
    );

    expect(result).toBeInstanceOf(Blob);
  });
});

describe("pdf", () => {
  it("should return a blob", async () => {
    const svg = `<svg height="100" width="100">
                        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                    </svg>`;

    const result = await pdf(
      [
        { svg, name: "Johnny" },
        { svg, name: "Alfred" },
      ],
      {}
    );

    expect(result).toBeInstanceOf(Blob);
  });
});

describe("svgzip", () => {
  it("should return a blob", async () => {
    const svg = `<svg height="100" width="100">
                        <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
                    </svg>`;

    const result = await svgzip(
      [
        { svg, name: "Johnny" },
        { svg, name: "Alfred" },
      ],
      {}
    );

    expect(result).toBeInstanceOf(Blob);
  });
});
