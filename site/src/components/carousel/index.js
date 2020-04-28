import React from "react"

import classnames from "classnames"
import withWindow from "../../utils/withWindow"
import useCurrentWitdh from "../../utils/useCurrentWitdh"

import "./styles.css"

const PREV_KEYS = [38, 37, 72, 75] // up, left, h, k
const NEXT_KEYS = [40, 39, 74, 76] // down, right, j, l

//
// images: array of image. { url, title }
//
function Carousel({ images = [], height, onClickRoot }) {
  const [width, setWidth] = React.useState(0)
  const [isHoverMode, setIsHoverMode] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const windowWidth = useCurrentWitdh()

  const nbImages = images.length

  const rootRef = React.useRef(null)

  // set isHoverMode to true and hide it after some time
  let timeoutId = null
  const activateHoverMode = () => {
    setIsHoverMode(true)
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      setIsHoverMode(false)
    }, 600)
  }

  // currentIndex utilities

  const previous = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(nbImages - 1)
    }
  }

  const next = () => {
    if (currentIndex + 1 === nbImages) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // window resize handling: retrieve our carousel width
  // we use the windowWidth to recalculate our element width when the window width changed
  // (is resized).
  React.useEffect(() => {
    setWidth(rootRef.current?.offsetWidth || 0)
  }, [rootRef.current, setWidth, windowWidth])

  // keyboard shortcuts handling
  const handleKeyDown = React.useCallback(
    e => {
      // arrow up/down button should select next/previous list element.
      // we also use vim-keys (h,j,k,l)
      if (PREV_KEYS.indexOf(e.keyCode) >= 0) {
        previous()
      } else if (NEXT_KEYS.indexOf(e.keyCode) >= 0) {
        next()
      }

      activateHoverMode()
    },
    [setIsHoverMode, setCurrentIndex, currentIndex]
  )

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div
      ref={rootRef}
      role="presentation"
      className="carousel relative cursor-pointer text-center overflow-hidden"
      // allow parent to define a custom onClickRoot. By default we display the next image on click
      onClick={onClickRoot || next}
      onMouseEnter={activateHoverMode}
      onMouseLeave={() => setIsHoverMode(false)}
    >
      <div
        className="flex carousel-slides"
        style={{
          transform: `translateX(-${currentIndex * width}px)`,
        }}
      >
        {images.map(image => (
          <div
            key={image.url}
            className="carousel-slide flex relative justify-center items-center w-full"
            style={{
              height,
            }}
          >
            <img
              src={image.url}
              alt={image.title}
              // - pointer-events-none remove events. For example it avoids pinterest browser plugin
              // to appear on the image.
              // - select-none avoid "text selection" on image.
              className="pointer-events-none select-none w-full object-cover"
            />
          </div>
        ))}
      </div>
      <div
        className={classnames(
          "carousel-landmarks flex absolute w-full bottom-0",
          {
            invisible: !isHoverMode,
          }
        )}
      >
        {images.map((image, index) => {
          const isCurrent = index === currentIndex

          return (
            <div key={image.url} className="flex flex-auto p-1">
              <div
                className={classnames("image-landmark rounded-full w-full", {
                  current: isCurrent,
                })}
              />
            </div>
          )
        })}
      </div>

      {/* 
          Display invisible tile on top of the image. One tile per image, allowing us to scroll to 
          the image corresponding to the tile the mouse is hover 
      */}
      {images.map((image, index) => {
        const tileWidth = width / images.length

        return (
          <div
            key={image.url}
            onMouseEnter={() => {
              activateHoverMode()
              setCurrentIndex(index)
            }}
            className="absolute select-none inset-y-0"
            style={{
              left: index * tileWidth,
              width: tileWidth,
            }}
          />
        )
      })}
    </div>
  )
}

export default withWindow(Carousel)
