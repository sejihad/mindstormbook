const authors = [
  "T J Klune",
  "Leo Tolstoy",
  "Virginia Woolf",
  "Humuan Ahmed",
  "Vladimir Nabokov",
  "William Faulkner",
];

const Authors = () => {
  return (
    <section className="py-6 px-4">
      <h3 className="text-xl font-semibold border-b mb-4">Book Authors</h3>
      <div className="flex gap-6 flex-wrap justify-center">
        {authors.map((name, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-2"></div>
            <p>{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Authors;
