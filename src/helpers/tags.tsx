const TAG_REGEX = /(#[^ |#]+)/g;

export const formatNoteTags = (noteText: string) => noteText
  .split(TAG_REGEX)
  .map((word, i) => {
    if (word.match(TAG_REGEX) !== null) {
      return (
        <span key={i} style={{ color: 'blue' }}>
          {word}
        </span>
      );
    } else {
      return <span key={i}>{word}</span>;
    }
  });

export const collectTags = (text: string) => {  
  const matches = text.match(TAG_REGEX);

  return matches || [];
}