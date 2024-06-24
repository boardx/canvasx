/*
Detailed Explanation
type (string): This field is crucial as it defines the nature of the content being handled. It helps the system to determine the appropriate handler or adapter for the data when copying or pasting. For instance, data with a type of "image" could be treated differently from data with a type of "text".

content (any): The use of any for the content type allows for maximum flexibility. This property could contain anything from simple strings or numbers to more complex data structures like JSON objects, HTML elements, or binary data in the form of ArrayBuffer or Blob, depending on what is being copied.

metadata (object): This field can be used to store additional, non-essential but useful information about the content. Metadata could include:

source: Where the data originated from, such as a URL or internal component identifier.
timestamp: When the data was copied.
size: Relevant for files or images, indicating the size of the data.
permissions: Information about who can access or modify the data, especially useful in collaborative environments.
*/

export interface ClipboardData {
  // Specifies the type of the data (e.g., 'text', 'image', 'html', 'file', etc.)
  type: string;

  // Holds the actual data content. The type of this property can vary based on the 'type' field.
  // For example, it could be a string for text, a Blob for files, or a complex object for structured data.
  content: any;

  // Contains additional information about the data that might be useful for processing or handling,
  // such as the source URL, timestamps, or specific attributes related to the content.
  metadata: object;
}
