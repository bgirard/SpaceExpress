import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  ThemeProvider,
  createTheme,
  createSounds,
  Arwes,
  Animate,
  Header,
  Footer,
  Frame,
  Animation,
  Button,
  SoundsProvider,
} from "arwes";
import { useContext, useState, useEffect } from "react";

function usePersistedState(key, defaultValue) {
  const [state, setState] = React.useState(
    () => JSON.parse(localStorage.getItem(key)) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}

const isServer = () => typeof window === `undefined`;

const mySounds = {
  shared: { volume: 1 }, // Shared sound settings
  players: {
    // The player settings
    click: {
      // With the name the player is created
      sound: { src: ["/sounds/click.mp3"] }, // The settings to pass to Howler
    },
    typing: {
      sound: { src: ["/sounds/typing.mp3"] },
      settings: { oneAtATime: true }, // The custom app settings
    },
    deploy: {
      sound: { src: ["/sounds/deploy.mp3"] },
      settings: { oneAtATime: true },
    },
  },
};

const tabs = {
  construction: () => {
    return <>This is the construction tab</>;
  },
  research: () => {
    return <>This is the research tab</>;
  },
  news: ({ setTab }) => {
    return (
      <Animation show={true} appear={true} animate>
        {(anim) => <IntroDialog anim={anim} setTab={setTab} />}
      </Animation>
    );
  },
};

const TechnologyContext = React.createContext({});

function TechnologyProvider({ children }) {
  const [techUnlocked, setTechUnlocked] = usePersistedState("tech", {});
  const context = {
    unlock: (techName) => {
      setTechUnlocked({ ...techUnlocked, [techName]: true });
    },
    hasTech: (techName) => {
      return techUnlocked[techName] === true;
    },
  };
  return (
    <TechnologyContext.Provider value={context}>
      {children}
    </TechnologyContext.Provider>
  );
}

function useUnlockTech(techName) {
  const techContext = React.useContext(TechnologyContext);
  return () => {
    techContext.unlock(techName);
  };
}

function useTech(techName) {
  const techContext = React.useContext(TechnologyContext);
  return techContext.hasTech(techName);
}

function TabContainer({ tabs, selectedTab, setTab }) {
  const Tab = tabs[selectedTab];
  return <Tab setTab={setTab} />;
}

function Page({ children }) {
  const hasConstruction = useTech("construction");
  const hasNews = true;
  const [tab, setTab] = useState("news");
  return (
    <Arwes
      animate
      show
      background="/images/background.jpg"
      pattern="/images/glow.png"
    >
      {(anim) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Header>
            <>
              <>🚀 Space Express 🚀</>
              {hasNews && (
                <Animation show={true} appear={true} animate>
                  {(anim) => (
                    <Button
                      animate
                      show={anim.entered}
                      onClick={() => {
                        setTab("news");
                      }}
                    >
                      News
                    </Button>
                  )}
                </Animation>
              )}
              {hasConstruction && (
                <Animation show={true} appear={true} animate>
                  {(anim) => (
                    <Button
                      animate
                      show={anim.entered}
                      onClick={() => {
                        setTab("construction");
                      }}
                    >
                      Construction
                    </Button>
                  )}
                </Animation>
              )}
            </>
          </Header>
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "10px",
              }}
            >
              <Frame animate show={anim.entered} level={1} corners={3}>
                {(anim) => (
                  <div style={{ padding: "5px" }}>
                    {
                      <TabContainer
                        tabs={tabs}
                        selectedTab={tab}
                        setTab={setTab}
                      />
                    }
                  </div>
                )}
              </Frame>
            </div>
          </div>
          <Footer style={{ fontSize: "75%", paddingLeft: "10px" }}>
            Built in 2020 using NextJS & Arwes - Benoit Girard
          </Footer>
        </div>
      )}
    </Arwes>
  );
}

function IntroDialog({ anim, setTab }) {
  const unlockConstruction = useUnlockTech("construction");
  return (
    <>
      <Header animate anim={anim.entered}>
        Space Express has been founded!
      </Header>
      <p>
        Welcome to 🚀 Space Express 🚀 bright musketeer. You are the founder and
        have been appointed yourself as lead engineer. Your mission is to
        develop the technology required to become a multi-planetery species and
        colonize mars.
      </p>
      <p>
        To accomplish this goal you will need to build a thriving space program.
        But today you will start with a small step. Build a prototype rocket to
        gain research points and raise additional funding.
      </p>
      <Button
        animate
        show={true}
        onClick={() => {
          unlockConstruction();
          setTab("construction");
        }}
      >
        Start Construction
      </Button>
    </>
  );
}

export default function Home() {
  if (isServer()) {
    return null;
  }
  return (
    <ThemeProvider theme={createTheme()}>
      <SoundsProvider sounds={createSounds(mySounds)}>
        <TechnologyProvider>
          <Page></Page>
        </TechnologyProvider>
      </SoundsProvider>
    </ThemeProvider>
  );
}
