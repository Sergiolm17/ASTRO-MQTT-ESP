import React, { useState, useEffect } from "react";
import {
  useSpeechRecognition,
  useSpeechSynthesis,
} from "react-speech-kit/dist";
import useFetch from "use-http";
const url = "https://us-central1-srsergio-iot.cloudfunctions.net";
export default function SpeechRecognition() {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(false);
  const { post } = useFetch(url);
  const { speak, voices } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
      console.log(result);
    },
    onEnd: async () => {
      const { fulfillmentText } = await post("/dialogflowGateway", {
        sessionId: "foo",
        queryInput: {
          text: {
            text: value,
            languageCode: "es-MX",
          },
        },
      });
      speak({ text: fulfillmentText, voice: voices[1] });
      console.log(fulfillmentText);
    },
  });
  useEffect(() => {
    if (active) listen({ lang: "es-MX" });
    else stop();
  }, [active]);
  return (
    <div>
      <button
        onClick={() => setActive(!active)}
        //onMouseDown={() => }
        //onMouseUp={stop}
      >
        👍🏼👍🏼👍🏼👍🏼👍🏼👍🏼👍🏼👍🏼
      </button>
      {value}
    </div>
  );
}

//{listening && <div>Go ahead I'm listening</div>}
