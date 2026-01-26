
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import { Button } from "@/components/ui/button"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Pilcrow,
    Type,
    Palette,
} from "lucide-react"
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType
            unsetFontSize: () => ReturnType
        }
    }
}

const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: (fontSize) => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run()
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run()
            },
        }
    },
})
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface RichTextEditorProps {
    content: string | null
    onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextStyle,
            Color,
            FontSize,
        ],
        content: content || "",
        editorProps: {
            attributes: {
                class:
                    "rich-text prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt("URL")
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) {
            return
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    return (
        <div className="border rounded-md">
            <div className="sticky top-0 z-50 flex flex-wrap gap-1 border-b bg-muted/80 backdrop-blur-sm p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(editor.isActive("bold") && "bg-muted")}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(editor.isActive("italic") && "bg-muted")}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={cn(editor.isActive("paragraph") && "bg-muted")}
                    title="Paragraph"
                    type="button"
                >
                    <Pilcrow className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={cn(editor.isActive("heading", { level: 1 }) && "bg-muted")}
                    title="Heading 1"
                    type="button"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={cn(editor.isActive("heading", { level: 2 }) && "bg-muted")}
                    title="Heading 2"
                    type="button"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={cn(editor.isActive("heading", { level: 3 }) && "bg-muted")}
                    title="Heading 3"
                    type="button"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 4 }).run()
                    }
                    className={cn(editor.isActive("heading", { level: 4 }) && "bg-muted")}
                    title="Heading 4"
                    type="button"
                >
                    <Heading4 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 5 }).run()
                    }
                    className={cn(editor.isActive("heading", { level: 5 }) && "bg-muted")}
                    title="Heading 5"
                    type="button"
                >
                    <Heading5 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={cn(editor.isActive("bulletList") && "bg-muted")}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={cn(editor.isActive("orderedList") && "bg-muted")}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={cn(editor.isActive("blockquote") && "bg-muted")}
                    type="button"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={setLink}
                    className={cn(editor.isActive("link") && "bg-muted")}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={addImage} type="button">
                    <ImageIcon className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1 border-l border-r px-2 mx-1">
                    <Label className="sr-only">Color</Label>
                    <input
                        type="color"
                        onInput={(event: any) => editor.chain().focus().setColor(event.target.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="w-6 h-6 p-0 border-none cursor-pointer"
                        title="Text Color"
                    />
                    <div className="flex items-center">
                        <Type className="w-4 h-4 mr-1 text-muted-foreground" />
                        <select
                            onChange={(e) => {
                                const size = e.target.value
                                if (size === 'default') {
                                    editor.chain().focus().unsetFontSize().run()
                                } else {
                                    editor.chain().focus().setFontSize(size).run()
                                }
                            }}
                            className="h-6 w-16 text-xs border rounded bg-transparent"
                            value={editor.getAttributes('textStyle').fontSize || 'default'}
                            title="Font Size"
                        >
                            <option value="default">Auto</option>
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px">16px</option>
                            <option value="18px">18px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="30px">30px</option>
                            <option value="36px">36px</option>
                            <option value="48px">48px</option>
                            <option value="60px">60px</option>
                            <option value="72px">72px</option>
                        </select>
                    </div>
                </div>
                <div className="ml-auto flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        type="button"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        type="button"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <EditorContent editor={editor} className="min-h-[300px] max-h-[600px] overflow-y-auto p-4 rich-text" />
        </div>
    )
}
