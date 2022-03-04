import "./index.css";

const Index = ({ label, ...props }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        paddingLeft: "0.1em",
        paddingRight: "0.1em",
        marginTop: "2em",
      }}
    >
      <label
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          marginLeft: "0.1rem",
        }}
        htmlFor={props.name}
      >
        {label ?? "please add label"}
      </label>
      <input {...props} />
    </div>
  );
};

export default Index;
