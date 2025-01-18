export const sampleLyrics = `
Intro
C   F/A   C/G   F/A


Verse 1
             C              C/E   F
What gift of grace is Jesus my redeemer
            C               Am     G
There is no more for heaven now to give
         C                C/E       F
He is my joy, my righteousness, and freedom
             C        G                  C/F   C
My steadfast love, my deep and boundless peace


Chorus 1
          F                     C
To this I hold, my hope is only Jesus
C/E    F       C               G
For my life is wholly bound to His
       C           Dm            C/E          F
Oh how strange and divine, I can sing  all is mine 
        C/G            G         C
Yet not I, but through Christ in me


Interlude
C   F/A   C/G   F/A


Verse 2
             C             C/E   F
The night is dark but I am not forsaken
           C                Am      G
For by my side, the Saviour He will stay
         C              C/E    F
I labour on in weakness and rejoicing
          C         G           C/F   C
For in my need, His power is displayed


Chorus 2
   C/E    F                        C
To this I hold, my Shepherd will defend me
C/E         F       C               G
Through the deepest valley He will lead
       C              Dm         C/E       F
Oh the night has been won, and I shall overcome 
        C/G            G         C
Yet not I, but through Christ in me


Interlude


Verse 3
           C              C/E   F
No fate I dread, I know I am forgiven
           C                  Am       G
The future sure, the price it has been paid
          C                 C/E    F
For Jesus bled and suffered for my pardon
           C         G             C/F   C
And He was raised to overthrow the grave


Chorus 3
   C/E    F                       C
To this I hold, my sin has been defeated
C/E   F       C          G
Jesus now and ever is my plea
       C            Dm            C/E        F
Oh the chains are released, I can sing, I am free 
        C/G            G         C/F   C
Yet not I, but through Christ in me


Interlude


Verse 4 (bare, then build)
           C                       F
With every breath I long to follow Jesus
           C                 Am       G
For He has said that He will bring me home
           C             C/E    F
And day by day I know He will renew me
        C          G              C/F   C
Until I stand with joy before the throne


Chorus 4 (x2)
   C/E    F                     C
To this I hold, my hope is only Jesus
C/E     F     C           G
All the glory evermore to Him
         C          Dm              C/E          F
When the race is complete, still my lips shall repeat 
        C/G            G         C/F   C
Yet not I, but through Christ in me 


Tag
         C           Dm             C/E          F        
When the race is complete, still my lips shall repeat 
        C/G            G         Am    F
Yet not I, but through Christ in me 
        C/G            G         Am    F
Yet not I, but through Christ in me 
        C/G            G         C
Yet not I, but through Christ in me


Outro
C   F/A   C/G   F/A
`;

export const chordSteps: (string | [string, string])[] = [
  "A",
  ["A#", "Bb"],
  "B",
  "C",
  ["C#", "Db"],
  "D",
  ["D#", "Eb"],
  "E",
  "F",
  ["F#", "Gb"],
  "G",
  ["G#", "Ab"],
];

export const songSectionRegex =
  /^[\(\[\{]?(intro|chorus|refrain|verse|v|bridge|tag|pre[-\s]?chorus|interlude|outro)\s?\d*[\)\]\}]?/i;

export const notePattern = "[A-G][b#]?";

export function chordRegex() {
  const altered = `(?:2|5|dim(5|7)?|aug5?|\\+5?|-5?)`;
  const minor = "(?:mi?n?)";
  const major = "(?:maj?|Ma?j?)";
  const majorableExt = `(?:6|7|9|11|13)`;
  const ext = `(?:4|6|7|9|11|13|6\\/9)`;
  const _mod = "(?:[b-](5|6|9|13)|[#+](4|5|9|11))";
  const mod = `(?:\\(${_mod}\\)|${_mod})`;
  const sus = "(?:sus(2|4|24|2sus4)?)";
  const add = "(?:add[b#]?(?:2|4|6|7|9|11|13))";
  const bass = `(?:\\/${notePattern})`;

  const lookahead = "(?=$| )";
  const source = `${notePattern}${`(?:${altered}|${
    `(?:${minor}?(?:${ext}|${major}?${majorableExt})?)` +
    `${mod}*${sus}?${mod}*${add}?`
  })`}${bass}?${lookahead}`;

  return source;
}
