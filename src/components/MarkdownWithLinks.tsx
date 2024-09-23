import ReactMarkdown from "react-markdown";

const MarkdownWithLinks: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }} // Apply blue color and underline
          >
            {props.children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownWithLinks;
