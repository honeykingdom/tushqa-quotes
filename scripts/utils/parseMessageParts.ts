import R from "ramda";
import { MessagePart, TwitchEmote, BttvEmote, FfzEmote, Emoji } from "types";
import emojisMap from "./emojisMap.json";

const emotes: Record<string, ["twitch" | "ffz" | "bttv", number | string]> = {
  "R)": ["twitch", 14],
  ";p": ["twitch", 13],
  ":p": ["twitch", 12],
  ";)": ["twitch", 11],
  ":\\": ["twitch", 10],
  "<3": ["twitch", 9],
  ":O": ["twitch", 8],
  "B)": ["twitch", 7],
  O_o: ["twitch", 6],
  ":|": ["twitch", 5],
  ">(": ["twitch", 4],
  ":D": ["twitch", 3],
  ":(": ["twitch", 2],
  ":)": ["twitch", 1],
  ResidentSleeper: ["twitch", 245],
  "4Head": ["twitch", 354],
  mcaT: ["twitch", 35063],
  KomodoHype: ["twitch", 81273],
  LUL: ["twitch", 425618],
  PogChamp: ["twitch", 305954156],
  "4HEader": ["ffz", 165784],
  FeelsWowMan: ["ffz", 391932],
  FeelsOkayMan: ["ffz", 450530],
  KKomrade: ["ffz", 305820],
  KKonaW: ["ffz", 229486],
  "4Shrug": ["ffz", 226912],
  "4House": ["ffz", 406860],
  "4HEad": ["ffz", 128247],
  "3Head": ["ffz", 274406],
  Dovolen: ["ffz", 321688],
  peepoClown: ["ffz", 318914],
  FeelsStrongMan: ["ffz", 585292],
  PeepoWeird: ["ffz", 243682],
  Pepepains: ["ffz", 227992],
  peepoSmoke: ["ffz", 349481],
  monkaW: ["ffz", 214681],
  monkaHmm: ["ffz", 314987],
  HYPERS: ["ffz", 240931],
  SadCat: ["ffz", 357348],
  peepoPoo: ["ffz", 307828],
  monkaB: ["ffz", 305845],
  Pepega: ["ffz", 243789],
  LULW: ["ffz", 139407],
  pepoS: ["ffz", 202129],
  monkaX: ["ffz", 226921],
  FeelsThinkingMan: ["ffz", 197630],
  FeelsTastyMan: ["ffz", 213195],
  widepeepoHappy: ["ffz", 270930],
  BootyButt: ["ffz", 350340],
  Naru2Head: ["ffz", 369223],
  roflanEbalo: ["ffz", 289129],
  YIKERS: ["ffz", 313785],
  MmmYea: ["ffz", 262166],
  peepoKnife: ["ffz", 270499],
  peepoHappy: ["ffz", 228449],
  PepoThink: ["ffz", 174942],
  FeelsWeirdMan: ["ffz", 131597],
  Pog: ["ffz", 210748],
  catJAM: ["bttv", "5f1b0186cf6d2144653d2970"],
  CatJam: ["bttv", "5f1b0186cf6d2144653d2970"],
  pepeJAMMER: ["bttv", "5f7bc0e2ce8bc74a94246971"],
  PogU: ["bttv", "60465403306b602acc599226"],
  PogT: ["bttv", "600ca1ac82cf6865d552d19d"],
  peepoJaMi: ["bttv", "5e53081508b4447d56a95abd"],
  Zoomer: ["bttv", "5bb4152cd51e3c34bdc2c6dc"],
  EZ: ["bttv", "5590b223b344e2c42a9e28e3"],
  HappyCat: ["bttv", "5f13f757cf6d2144653cc6de"],
  GuitarTime: ["bttv", "576befd71f520d6039622f7e"],
  PepoG: ["bttv", "5e7f9797d6581c3724c17180"],
  peepoClap: ["bttv", "5d38aaa592fc550c2d5996b8"],
  widepeepoHappyRightHeart: ["bttv", "5d38d136330f630c33eb5698"],
  peepoGlad: ["bttv", "5e1a0e188af14b5f1b4384c7"],
  PepoDance: ["bttv", "5a6edb51f730010d194bdd46"],
  BoomerPls: ["bttv", "5c0a9bac04ce5c33ac7b13a2"],
  bUrself: ["bttv", "566c9f3b65dbbdab32ec052e"],
  monkaEXTREME: ["bttv", "5b8a9c6f80c14b0422a7b2a0"],
  LizSense: ["bttv", "5ebd8941ec17d81685a4eb28"],
  SchubertWalk: ["bttv", "5c707362b80b802336fbb84a"],
  Leddit: ["bttv", "5de847afe7df1277b606d888"],
  polarExtreme: ["bttv", "5afa12b61260c3359cb41fba"],
  RareParrot: ["bttv", "55a24e1294dd94001ee86b39"],
  RarestParrot: ["bttv", "56a6316731f511db3dde2042"],
  KKool: ["bttv", "56c2cff2d9ec6bf744247bf1"],
  WeirdChamp: ["bttv", "5d20a55de1cfde376e532972"],
  weirdChamp: ["bttv", "5d20a55de1cfde376e532972"],
  PepoCheer: ["bttv", "5abd36396723dc149c678e90"],
  LasqaPls: ["bttv", "5bbb8873e4ed26378c1e9e0b"],
  peepoSprint: ["bttv", "5c20a897fef84f19d3274cb0"],
  chikaYo: ["bttv", "5c69f5caadab351034b3fcc1"],
  lasLier: ["bttv", "5cf0347e6bb1c73a966d1b7a"],
  lickL: ["bttv", "5afdd15ab5f610729e2f6e7a"],
  pomRight: ["bttv", "57ed2a45f17511ff6f99b605"],
  EatPooPoo: ["bttv", "5903ae40981c752327938935"],
  VolgaPls: ["bttv", "5d375499330f630c33eb4d26"],
  CrabPls: ["bttv", "5c2a4ddda402f16774559abe"],
  pepeBASS: ["bttv", "5b215a245eaa38694dc91635"],
  Clap: ["bttv", "55b6f480e66682f576dd94f5"],
  PepegaAim: ["bttv", "5d0d7140ca4f4b50240ff6b4"],
  EZDance: ["bttv", "5bfea90de7a4c109c7d4562b"],
  HACKERMANS: ["bttv", "5b490e73cf46791f8491f6f4"],
  PepeChill: ["bttv", "5eb9d6c6813f92169355870e"],
};

const emojisList = Object.values(emojisMap);

const findEmojiByChar = (char: string) => {
  const result = R.find(R.propEq("char", char), emojisList);

  if (!result) return null;

  return ["emoji", result.short, result.unified] as Emoji;
};

const findEmoteByName = (name: string) => {
  const result = emotes[name];

  if (!result) return null;

  return [result[0], result[1], name] as TwitchEmote | BttvEmote | FfzEmote;
};

const censureMessage = (message: string) =>
  message.replace(/(д)ау(н)/gi, "$1**$2");

const parseMessageParts = (message: string) => {
  const words = message.split(" ");

  const result: MessagePart[] = [];

  words.forEach((word, i, arr) => {
    const isLast = arr.length - 1 === i;
    const entity = findEmoteByName(word) || findEmojiByChar(word);

    if (entity) {
      result.push(entity);

      if (!isLast) {
        result.push(" ");
      }
    } else {
      const isLastItemString = typeof result[result.length - 1] === "string";

      if (isLastItemString) {
        result[result.length - 1] += isLast ? word : `${word} `;
      } else {
        result.push(isLast ? word : `${word} `);
      }
    }
  });

  return result.map((part) =>
    typeof part === "string" ? censureMessage(part) : part
  );
};

export default parseMessageParts;
