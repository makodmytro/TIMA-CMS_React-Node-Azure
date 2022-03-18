import memoize from 'lodash/memoize';

export const getTopicLevels = (id, topics) => {
  const zero = topics.find((t) => t.id === id);

  if (zero) {
    return [zero];
  }

  const topicParent = topics.find((t) => {
    return (t?.ChildTopics || []).some((tc) => tc.id === id);
  });

  if (topicParent) {
    const one = topicParent?.ChildTopics.find((ct) => ct.id === id);

    return [topicParent, one];
  }

  let parent;
  let child;
  let grandchild;

  topics.forEach((topic) => {
    (topic.ChildTopics || []).forEach((children) => {
      (children.ChildTopics || []).forEach((grandChildren) => {
        if (grandChildren.id === id) {
          parent = topic;
          child = children;
          grandchild = grandChildren;
        }
      });
    });
  });

  if (!parent) {
    return [];
  }

  return [parent, child, grandchild];
};

export const getTreeLabel = memoize((id, topics) => {
  const levels = getTopicLevels(id, topics);

  return levels.map((level) => level.name).join(' - ');
});
