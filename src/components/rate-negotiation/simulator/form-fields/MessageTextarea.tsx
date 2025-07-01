
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MessageTextareaProps {
  message: string;
  onMessageChange: (message: string) => void;
}

const MessageTextarea = ({ message, onMessageChange }: MessageTextareaProps) => {
  return (
    <div>
      <Label htmlFor="message">Provider Message</Label>
      <Textarea 
        id="message"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Provider's response message..."
        className="h-40"
      />
    </div>
  );
};

export default MessageTextarea;
