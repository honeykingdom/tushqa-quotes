import path from "path";
import { promises as fs } from "fs";
import dotenv from "dotenv";

dotenv.config();

const channels = process.env.PARSED_CHANNELS!.split(";");
const chatterinoLogsFolder = process.env.CHATTERINO_LOGS_FOLDER!;
const twitchLogsFolder = process.env.TWITCH_LOGS_FOLDER!;

const main = async () => {
  const allFiles = await Promise.all(
    channels.map((channel) =>
      fs.readdir(path.join(chatterinoLogsFolder, channel))
    )
  );

  await Promise.all([
    ...allFiles.map((files, i) => {
      const channel = channels[i];
      const from = path.join(chatterinoLogsFolder, channel);
      const to = path.join(twitchLogsFolder, channel);

      return files.map((file) =>
        fs.copyFile(
          path.resolve(from, file),
          path.resolve(to, path.parse(file).base)
        )
      );
    }),
  ]);
};

main();
