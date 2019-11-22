const getRandomColor = () =>
  'rgba(' +
  [
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    0.5,
  ] +
  ')';

const assignColorsToTimelineRegions = timeline => {
  const colorMap = new Map();
  timeline.forEach(region => {
    const assignedColor = colorMap.get(region.label);
    if (!assignedColor) {
      colorMap.set(region.label, getRandomColor());
    }
  });

  return timeline.map(region => ({
    ...region,
    color: colorMap.get(region.label),
  }));
};

export const setWaveformRegions = (selectedTimelineRegions, wave) => {
  wave.clearRegions();
  selectedTimelineRegions.forEach(region => {
    wave.addRegion({
      start: region.start,
      end: region.end,
      color: region.color,
      drag: false,
      data: {
        content: region.label,
      },
    });
  });
  wave.on('region-created', region => {
    // Find region by start time
    const match = selectedTimelineRegions.find(
      annotation => annotation.start === region.start
    );
    // Add the "region" object to the annotation list item to access playback methods later
    match.region = region;
  });
};

const appendTimelineToPage = (name, timeline, audioLength) => {
  const containerEl = document.getElementById('timeline-container');
  const timelineEl = document.createElement('section');
  timelineEl.className = 'timeline';
  containerEl.appendChild(timelineEl);

  timeline.forEach((region, index) => {
    const percentStart = (region.start / audioLength) * 100;
    const percentEnd = (region.end / audioLength) * 100;
    const elPercentWidth = percentEnd - percentStart;

    const regionEl = document.createElement('button');
    regionEl.innerText = region.label;
    regionEl.setAttribute('data-index', index); // add an index attr to each button to see which was clicked
    regionEl.setAttribute('data-name', name); // add a name attr to see which timeline the button belongs to
    regionEl.setAttribute('data-start', region.start);
    regionEl.setAttribute('data-end', region.end);
    regionEl.className = 'timeline-region';
    regionEl.style.cssText = `
      width: ${elPercentWidth}%;
      left: ${percentStart}%;
      background-color: ${region.color};
    `;
    timelineEl.appendChild(regionEl);
  });
};

export const constructTimelines = (timelines, audioLength) => {
  if (!timelines || !timelines.length) return;

  const coloredTimelines = timelines.map(({ name, regions }) => {
    return {
      name: name,
      regions: assignColorsToTimelineRegions(regions),
    };
  });
  coloredTimelines.forEach(({ name, regions }) => {
    appendTimelineToPage(name, regions, audioLength);
  });
  return coloredTimelines;
};
