module.exports = {
    transform: {    
      "^.+\\.svelte$": "svelte-jester",
      "^.+\\.js$": "babel-jest"
    },
    moduleFileExtensions: ["js", "svelte"],
    testPathIgnorePatterns: ["node_modules", "libs"],
    bail: false,
    verbose: true,
    transformIgnorePatterns: ["node_modules", "libs"],
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
    coveragePathIgnorePatterns: ["libs"]
  };