const getColorForLanguage = (language: string) => {
    switch (language.toLowerCase()) {
      case "javascript":
        return "#f1e05a";
      case "python":
        return "#3572A5";
      case "html":
        return "#e34c26";
      case "css":
        return "#563d7c";
      case "java":
        return "#b07219";
      case "typescript":
        return "#2b7489";
      default:
        return "#000000";
    }
  };

  export default getColorForLanguage