const Error = ({ message }: { message: string }) => (
    <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg font-bold">{message}</p>
    </div>
)

export default Error