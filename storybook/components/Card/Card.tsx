import React from "react";
import styles from "./Card.module.css";
import Button from "../../atoms/Button/Button";

interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  callToAction?: string;
  object?: {
    title?: string;
    description?: string;
    image?: string;
    callToAction?: string;
    [key: string]: any;
  };
}

export default function Card(props: CardProps) {
  // Direct props override object props (only if truthy, not empty string)
  const obj: any = props.object ?? {};

  const title = props.title || obj.title;
  const description = props.description || obj.description;
  // Image priority: direct > object.image > metadata.images[0] > source_url (if image)
  const image =
    props.image ||
    obj.image ||
    obj.metadata?.images?.[0] ||
    (obj.source_url?.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) ? obj.source_url : undefined);
  const callToAction = props.callToAction || obj.callToAction || obj.metadata?.callToAction;

  return (
    <div className={styles.card}>
      {image && (
        <div className={styles.imageContainer}>
          <img src={image} alt={title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {callToAction && <Button>{callToAction}</Button>}
      </div>
    </div>
  );
}
